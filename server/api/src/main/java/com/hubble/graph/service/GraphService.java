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

    private static final int SEED_COUNT = 12;
    private static final int POPULAR_SEED_COUNT = 4;
    private static final int RECENT_SEED_COUNT = 4;
    private static final int DISCOVERY_SEED_COUNT = 4;
    private static final int SEED_CANDIDATE_COUNT = 60;
    private static final int EXPANSION_LIMIT_DEFAULT = 6;
    private static final int EXPANSION_LIMIT_MAX = 12;
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

        return expandFromRankedData(targetCategory, tagName, excluded, limit);
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

}
