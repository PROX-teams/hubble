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

    /**
     * 1. Most Loved: 전체 기간 종합 인기 노트 12건 독립 조회
     */
    public List<NoteSummaryResponse> getMostLovedNotes() {
        return noteRepository.findMostLovedNotes(MOST_LOVED_LIMIT).stream()
                .map(NoteSummaryResponse::from)
                .toList();
    }

    /**
     * 2. Discover: 최근 14일 트렌딩 탐색 노트 16건 독립 조회 (부족 시 Fallback 보충)
     */
    public List<NoteSummaryResponse> getDiscoverNotes() {
        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);

        List<Note> recentCandidates = noteRepository.findRecentTrendingNotes(
                fourteenDaysAgo, 
                DISCOVER_LIMIT
        );
        List<Note> discoverEntities = new ArrayList<>(recentCandidates);

        // 부족분 Fallback: 최근 14일 글이 16건 미만일 때 과거 인기글에서 보충
        if (discoverEntities.size() < DISCOVER_LIMIT) {
            int neededCount = DISCOVER_LIMIT - discoverEntities.size();
            List<Note> fallbackCandidates = noteRepository.findFallbackTrendingNotes(
                    fourteenDaysAgo,
                    neededCount + discoverEntities.size()
            );

            Set<Long> alreadyIncludedIds = discoverEntities.stream()
                    .map(Note::getId)
                    .collect(Collectors.toSet());

            fallbackCandidates.stream()
                    .filter(note -> !alreadyIncludedIds.contains(note.getId()))
                    .limit(neededCount)
                    .forEach(discoverEntities::add);
        }

        return discoverEntities.stream()
                .map(NoteSummaryResponse::from)
                .toList();
    }

    /**
     * 3. Trending Creators: 인기 크리에이터 5명 독립 조회
     */
    public List<TrendingCreatorResponse> getTrendingCreators() {
        List<TrendingCreatorDto> creatorDtos = userRepository.findTrendingCreators(PageRequest.of(0, CREATOR_LIMIT));
        return creatorDtos.stream()
                .map(TrendingCreatorResponse::from)
                .toList();
    }

    /**
     * 4. Trending Stories: 인기 스토리 12건 독립 조회
     */
    public List<StoryResponse> getPopularStories() {
        List<Story> popularStoryEntities = storyRepository.findPopularStoriesSlice(PageRequest.of(0, STORY_LIMIT)).getContent();
        return popularStoryEntities.stream()
                .map(story -> StoryResponse.of(story, false, false))
                .toList();
    }

    /**
     * 통합 조회: 4개 추천 데이터를 한 번에 조회 (BFF 및 단일 호출 지원)
     */
    public MainRecommendResponse getRecommendations() {
        List<NoteSummaryResponse> mostLovedNotes = getMostLovedNotes();
        List<NoteSummaryResponse> discoverNotes = getDiscoverNotes();
        List<TrendingCreatorResponse> creators = getTrendingCreators();
        List<StoryResponse> popularStories = getPopularStories();

        return MainRecommendResponse.of(mostLovedNotes, discoverNotes, creators, popularStories);
    }
}
