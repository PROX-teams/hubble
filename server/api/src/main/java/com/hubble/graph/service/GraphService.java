package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import com.hubble.graph.dto.response.GraphLinkResponse;
import com.hubble.graph.dto.response.GraphNodeResponse;
import com.hubble.graph.dto.response.GraphResponse;
import com.hubble.graph.dto.response.GraphExpansionResponse;
import com.hubble.note.dto.TagCountDto;
import com.hubble.note.repository.NoteRepository;
import com.hubble.note.repository.NoteTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GraphService {

    private final NoteRepository noteRepository;
    private final NoteTagRepository noteTagRepository;
    private final GraphStatsStore graphStatsStore;

    @Value("${graph.async.enabled:false}")
    private boolean asyncEnabled;

    private static final int SEED_COUNT = 12;
    private static final int POPULAR_SEED_COUNT = 4;
    private static final int RECENT_SEED_COUNT = 4;
    private static final int DISCOVERY_SEED_COUNT = 4;
    private static final int SEED_CANDIDATE_COUNT = 60;
    private static final int EXPANSION_LIMIT_DEFAULT = 6;
    private static final int EXPANSION_LIMIT_MAX = 12;
    private static final long MIN_CO_OCCURRENCE_COUNT = 2;
    private static final int NEIGHBOR_PAGE_SIZE = 128;
    private static final Comparator<RelationCandidate> RELATION_RANKING =
            Comparator.comparingDouble(RelationCandidate::jaccardScore).reversed()
                    .thenComparing(Comparator.comparingLong(RelationCandidate::coCount).reversed())
                    .thenComparing(RelationCandidate::tagName);

    /**
     * 카테고리별 탐색 시작점과 대표 태그를 생성합니다.
     */
    public GraphResponse getGraphData(Category category) {
        Category targetCategory = (category != null) ? category : Category.DEVELOPMENT;

        // 1. 1레벨 중심(루트) 노드 생성
        long categoryNoteCount = noteRepository.countByCategory(targetCategory);
        GraphNodeResponse rootNode = new GraphNodeResponse(
                "cat_" + targetCategory.name(),
                targetCategory.getDescription(),
                1,
                categoryNoteCount,
                null
        );

        // 시작 태그는 인기 태그, 최근 사용 태그, 중간 사용량 태그를 섞어 편향을 낮춘다.
        List<TagCountDto> popularTags = graphStatsStore.topTags(targetCategory, SEED_CANDIDATE_COUNT);
        List<TagCountDto> recentTags = noteTagRepository.findRecentTagsByCategory(
                targetCategory, LocalDate.now().minusDays(30).atStartOfDay(),
                PageRequest.of(0, SEED_CANDIDATE_COUNT));
        List<TagCountDto> seeds = selectSeedTags(popularTags, recentTags);
        if (seeds.isEmpty()) return GraphResponse.empty(targetCategory, rootNode);
        Map<String, Long> seedUsageCounts = noteTagRepository.findTagCountsByCategoryAndTagNames(
                targetCategory, seeds.stream().map(TagCountDto::name).toList())
                .stream().collect(Collectors.toMap(TagCountDto::name, TagCountDto::count, (left, right) -> left));

        List<GraphNodeResponse> allNodes = new ArrayList<>();
        List<GraphLinkResponse> allLinks = new ArrayList<>();

        // 카테고리 루트와 시작 태그를 연결한다.
        for (TagCountDto tagDto : seeds) {
            String tagName = tagDto.name();
            long count = seedUsageCounts.getOrDefault(tagDto.name(), tagDto.count());
            String nodeId = "tag_" + tagName;

            allNodes.add(new GraphNodeResponse(
                    nodeId,
                    tagName,
                    2,
                    count,
                    rootNode.id()
            ));

            allLinks.add(new GraphLinkResponse(
                    rootNode.id(),
                    nodeId,
                    null,
                    null
            ));
        }

        return new GraphResponse(
                targetCategory,
                rootNode,
                allNodes,
                allLinks,
                false
        );
    }

    private List<TagCountDto> selectSeedTags(List<TagCountDto> popular, List<TagCountDto> recent) {
        LinkedHashMap<String, TagCountDto> selected = new LinkedHashMap<>();
        addSeeds(selected, popular, 0, Math.min(POPULAR_SEED_COUNT, popular.size()));
        addUniqueSeeds(selected, recent, RECENT_SEED_COUNT);

        // 중간 빈도 후보를 주 단위로 순환해 시작점이 상위 인기 태그에 고정되는 현상을 줄인다.
        int tailStart = Math.min(POPULAR_SEED_COUNT, popular.size());
        List<TagCountDto> discoveryPool = popular.subList(tailStart, popular.size());
        if (!discoveryPool.isEmpty()) {
            int offset = (int) ((LocalDate.now().toEpochDay() / 7) % discoveryPool.size());
            for (int i = 0; i < discoveryPool.size() && selected.size() < SEED_COUNT; i++) {
                TagCountDto candidate = discoveryPool.get((offset + i) % discoveryPool.size());
                selected.putIfAbsent(candidate.name(), candidate);
                if (selected.size() >= POPULAR_SEED_COUNT + RECENT_SEED_COUNT + DISCOVERY_SEED_COUNT) break;
            }
        }
        addUniqueSeeds(selected, popular, SEED_COUNT - selected.size());
        return selected.values().stream().limit(SEED_COUNT).toList();
    }

    private void addSeeds(LinkedHashMap<String, TagCountDto> selected, List<TagCountDto> candidates, int start, int count) {
        candidates.stream().skip(start).limit(count).forEach(tag -> selected.putIfAbsent(tag.name(), tag));
    }

    private void addUniqueSeeds(LinkedHashMap<String, TagCountDto> selected, List<TagCountDto> candidates, int count) {
        for (TagCountDto candidate : candidates) {
            if (selected.size() >= SEED_COUNT || count <= 0) break;
            if (selected.putIfAbsent(candidate.name(), candidate) == null) count--;
        }
    }

    public GraphExpansionResponse expandTag(Category category, String tagName, List<String> excludedTags, int requestedLimit) {
        Category targetCategory = category != null ? category : Category.DEVELOPMENT;
        int limit = Math.max(1, Math.min(requestedLimit <= 0 ? EXPANSION_LIMIT_DEFAULT : requestedLimit, EXPANSION_LIMIT_MAX));
        Set<String> excluded = (excludedTags == null ? List.<String>of() : excludedTags)
                .stream().filter(Objects::nonNull).filter(name -> !name.isBlank())
                .collect(Collectors.toSet());
        excluded.add(tagName);

        if (asyncEnabled) return expandFromRankedData(targetCategory, tagName, excluded, limit);

        Optional<GraphStatsStore.Center> center = graphStatsStore.center(targetCategory, tagName);
        if (center.isEmpty()) return new GraphExpansionResponse(targetCategory, tagName, List.of(), List.of(), false);

        long centerUsage = center.get().usageCount();
        int targetCount = limit + 1; // one extra candidate determines hasMore
        PriorityQueue<RelationCandidate> best = new PriorityQueue<>(targetCount, RELATION_RANKING.reversed());
        GraphStatsStore.Cursor cursorA = null;
        GraphStatsStore.Cursor cursorB = null;
        boolean fetchA = true;
        boolean fetchB = true;

        while (fetchA || fetchB) {
            List<GraphStatsStore.Neighbor> sideA = fetchA
                    ? graphStatsStore.neighborPage(targetCategory, center.get().tagId(), GraphStatsStore.Side.TAG_A,
                    cursorA, MIN_CO_OCCURRENCE_COUNT, NEIGHBOR_PAGE_SIZE) : List.of();
            List<GraphStatsStore.Neighbor> sideB = fetchB
                    ? graphStatsStore.neighborPage(targetCategory, center.get().tagId(), GraphStatsStore.Side.TAG_B,
                    cursorB, MIN_CO_OCCURRENCE_COUNT, NEIGHBOR_PAGE_SIZE) : List.of();

            for (GraphStatsStore.Neighbor neighbor : sideA) addCandidate(best, neighbor, centerUsage, excluded, targetCount);
            for (GraphStatsStore.Neighbor neighbor : sideB) addCandidate(best, neighbor, centerUsage, excluded, targetCount);

            fetchA = sideA.size() == NEIGHBOR_PAGE_SIZE;
            fetchB = sideB.size() == NEIGHBOR_PAGE_SIZE;
            if (fetchA) {
                GraphStatsStore.Neighbor last = sideA.get(sideA.size() - 1);
                cursorA = new GraphStatsStore.Cursor(last.coCount(), last.tagId());
            }
            if (fetchB) {
                GraphStatsStore.Neighbor last = sideB.get(sideB.size() - 1);
                cursorB = new GraphStatsStore.Cursor(last.coCount(), last.tagId());
            }

            // Jaccard = co / (centerUsage + neighborUsage - co) <= co / centerUsage.
            // Unseen rows have co <= the last row of their side. A strict bound
            // preserves score/co-count/name tie ordering as well as exact hasMore.
            long unseenMaxCo = Math.max(fetchA ? cursorA.coCount() : 0, fetchB ? cursorB.coCount() : 0);
            if (best.size() == targetCount && (double) unseenMaxCo / centerUsage < best.peek().jaccardScore()) {
                break;
            }
        }

        List<RelationCandidate> ranked = best.stream().sorted(RELATION_RANKING).toList();
        List<RelationCandidate> page = ranked.stream().limit(limit).toList();
        String sourceId = "tag_" + tagName;
        List<GraphNodeResponse> nodes = page.stream().map(candidate -> new GraphNodeResponse(
                "tag_" + candidate.tagName(), candidate.tagName(), 3,
                candidate.usageCount(), sourceId)).toList();
        List<GraphLinkResponse> links = page.stream().map(candidate -> new GraphLinkResponse(
                sourceId, "tag_" + candidate.tagName(), candidate.coCount(),
                Math.round(candidate.jaccardScore() * 100.0) / 100.0)).toList();
        return new GraphExpansionResponse(targetCategory, tagName, nodes, links, ranked.size() > limit);
    }

    private GraphExpansionResponse expandFromRankedData(Category category, String tagName,
                                                        Set<String> excluded, int limit) {
        List<GraphStatsStore.RankedNeighbor> rows = graphStatsStore.rankedNeighbors(
                category, tagName, excluded, limit + 1);
        String sourceId = "tag_" + tagName;
        List<GraphStatsStore.RankedNeighbor> page = rows.stream().limit(limit).toList();
        List<GraphNodeResponse> nodes = page.stream().map(row -> new GraphNodeResponse(
                "tag_" + row.name(), row.name(), 3, row.usageCount(), sourceId)).toList();
        List<GraphLinkResponse> links = page.stream().map(row -> new GraphLinkResponse(
                sourceId, "tag_" + row.name(), row.coCount(),
                Math.round(row.score() * 100.0) / 100.0)).toList();
        return new GraphExpansionResponse(category, tagName, nodes, links, rows.size() > limit);
    }

    private void addCandidate(PriorityQueue<RelationCandidate> best, GraphStatsStore.Neighbor neighbor,
                              long centerUsage, Set<String> excluded, int targetCount) {
        if (excluded.contains(neighbor.name())) return;
        long union = centerUsage + neighbor.usageCount() - neighbor.coCount();
        double score = union > 0 ? (double) neighbor.coCount() / union : 0.0;
        best.add(new RelationCandidate(neighbor.name(), neighbor.coCount(), neighbor.usageCount(), score));
        if (best.size() > targetCount) best.poll();
    }

    private record RelationCandidate(
            String tagName,
            long coCount,
            long usageCount,
            double jaccardScore
    ) {
    }
}
