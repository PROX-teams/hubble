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

import java.util.List;

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

        // 2. Discover: Most Loved 글 제외(중복 방지) 및 최근 트렌딩 우선 16개 조회
        List<Long> excludeIds = mostLovedEntities.stream().map(Note::getId).toList();
        List<Note> discoverEntities = noteRepository.findDiscoverNotes(excludeIds, DISCOVER_LIMIT);

        // 등록된 전체 글 수가 적어 제외 후 결과가 비어있는 경우 Fallback으로 채움 (Graceful Fallback)
        if (discoverEntities.isEmpty()) {
            discoverEntities = noteRepository.findDiscoverNotes(null, DISCOVER_LIMIT);
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
