package com.hubble.recommend.service;

import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.repository.NoteRepository;
import com.hubble.recommend.dto.response.MainRecommendResponse;
import com.hubble.recommend.dto.response.TrendingCreatorResponse;
import com.hubble.story.dto.response.StoryResponse;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import com.hubble.user.dto.TrendingCreatorDto;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MainRecommendService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final StoryRepository storyRepository;

    private static final int MOST_LOVED_LIMIT = 12;
    private static final int DISCOVER_LIMIT = 16;
    private static final int CREATOR_LIMIT = 5;
    private static final int STORY_LIMIT = 12;

    public MainRecommendResponse getRecommendations() {
        // 1. Most Loved: 전체 기간 종합 인기 노트 12개 조회
        List<Note> mostLovedEntities = noteRepository.findMostLovedNotes(MOST_LOVED_LIMIT);
        List<NoteSummaryResponse> mostLovedNotes = mostLovedEntities.stream()
                .map(NoteSummaryResponse::from)
                .toList();

        // 2. Discover: 최근 14일 인덱스 탐색 + Set 메모리 중복 필터링(DB NOT IN 0건) + 부족 시 2단계 Fallback
        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);
        Set<Long> mostLovedIdSet = mostLovedEntities.stream()
                .map(Note::getId)
                .collect(Collectors.toSet());

        // 1차 조회: 최근 14일 트렌딩 후보 (중복 대비 넉넉하게 30건 조회)
        List<Note> recentCandidates = noteRepository.findRecentTrendingNotes(
                fourteenDaysAgo, 
                DISCOVER_LIMIT + MOST_LOVED_LIMIT
        );

        List<Note> discoverEntities = new ArrayList<>(
                recentCandidates.stream()
                        .filter(note -> !mostLovedIdSet.contains(note.getId()))
                        .limit(DISCOVER_LIMIT)
                        .toList()
        );

        // 2차 조회 (부족분 Fallback): 최근 14일 글이 16건 미만일 때만 과거 인기글에서 보충 (DB 부하 최소화)
        if (discoverEntities.size() < DISCOVER_LIMIT) {
            int neededCount = DISCOVER_LIMIT - discoverEntities.size();
            List<Note> fallbackCandidates = noteRepository.findFallbackTrendingNotes(
                    fourteenDaysAgo,
                    neededCount + MOST_LOVED_LIMIT + discoverEntities.size()
            );

            Set<Long> alreadyIncludedIds = discoverEntities.stream()
                    .map(Note::getId)
                    .collect(Collectors.toSet());
            alreadyIncludedIds.addAll(mostLovedIdSet);

            fallbackCandidates.stream()
                    .filter(note -> !alreadyIncludedIds.contains(note.getId()))
                    .limit(neededCount)
                    .forEach(discoverEntities::add);

            // [극단적 Cold Start 대응] 전체 글이 극소수일 경우 빈 화면 방지를 위해 가용 노트로 보충
            if (discoverEntities.size() < DISCOVER_LIMIT && !mostLovedEntities.isEmpty()) {
                int stillNeed = DISCOVER_LIMIT - discoverEntities.size();
                mostLovedEntities.stream()
                        .filter(note -> !discoverEntities.contains(note))
                        .limit(stillNeed)
                        .forEach(discoverEntities::add);
            }
        }

        List<NoteSummaryResponse> discoverNotes = discoverEntities.stream()
                .map(NoteSummaryResponse::from)
                .toList();

        // 3. Creators: DB 단일 집계 쿼리로 인기 크리에이터 5명 조회 (N+1 제로)
        List<TrendingCreatorDto> creatorDtos = userRepository.findTrendingCreators(PageRequest.of(0, CREATOR_LIMIT));
        List<TrendingCreatorResponse> creators = creatorDtos.stream()
                .map(TrendingCreatorResponse::from)
                .toList();

        // 4. Stories: 가중치 인기도 점수 기준 상위 스토리 12개 조회 (User 페치 조인 및 BatchSize로 N+1 제로)
        List<Story> popularStoryEntities = storyRepository.findPopularStoriesSlice(PageRequest.of(0, STORY_LIMIT)).getContent();
        List<StoryResponse> popularStories = popularStoryEntities.stream()
                .map(story -> StoryResponse.of(story, false, false))
                .toList();

        return MainRecommendResponse.of(mostLovedNotes, discoverNotes, creators, popularStories);
    }
}
