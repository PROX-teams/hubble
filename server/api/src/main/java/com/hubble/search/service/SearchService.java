package com.hubble.search.service;

import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.repository.NoteRepository;
import com.hubble.note.repository.NoteTagRepository;
import com.hubble.search.dto.response.SearchResponse;
import com.hubble.story.dto.response.StoryResponse;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryBookmarkRepository;
import com.hubble.story.repository.StoryLikeRepository;
import com.hubble.story.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

    private final NoteRepository noteRepository;
    private final StoryRepository storyRepository;
    private final NoteTagRepository noteTagRepository;
    private final StoryLikeRepository storyLikeRepository;
    private final StoryBookmarkRepository storyBookmarkRepository;

    private static final int TAG_LIMIT = 10;

    public SearchResponse search(String keyword, Pageable pageable, Long userId) {
        boolean isSearching = StringUtils.hasText(keyword);
        String cleanKeyword = isSearching ? keyword.trim() : null;

        // 1. 태그 목록 조회 (검색 시 연관 태그, 미검색 시 서비스 전체 인기 태그)
        List<String> tags = isSearching
                ? noteTagRepository.searchTagNamesByKeyword(cleanKeyword, PageRequest.of(0, TAG_LIMIT))
                : noteTagRepository.findPopularTagNames(PageRequest.of(0, TAG_LIMIT));

        // 2. 스토리 목록 조회 (Slice 무한 스크롤 & 인기도 가중치)
        Slice<Story> storySlice = isSearching
                ? storyRepository.searchStoriesSlice(cleanKeyword, pageable)
                : storyRepository.findPopularStoriesSlice(pageable);
        Slice<StoryResponse> storyResponses = convertToStoryResponses(storySlice, userId);

        // 3. 노트 목록 조회 (Slice 무한 스크롤 & 키워드 Tier + 인기도 가중치)
        Slice<Note> noteSlice = noteRepository.searchNotesSlice(cleanKeyword, pageable);
        Slice<NoteSummaryResponse> noteResponses = noteSlice.map(NoteSummaryResponse::from);

        return SearchResponse.of(isSearching, tags, storyResponses, noteResponses);
    }

    /**
     * N+1 방지를 위해 현재 Slice에 포함된 모든 스토리의 좋아요/북마크 여부를 IN 쿼리로 일괄 조회하여 매핑합니다.
     */
    private Slice<StoryResponse> convertToStoryResponses(Slice<Story> storySlice, Long userId) {
        List<Story> stories = storySlice.getContent();
        if (stories.isEmpty()) {
            return storySlice.map(s -> null); // 빈 Slice 반환
        }

        List<Long> storyIds = stories.stream().map(Story::getId).toList();

        Set<Long> likedStoryIds = (userId != null)
                ? storyLikeRepository.findLikedStoryIdsByUserIdAndStoryIds(userId, storyIds)
                : Collections.emptySet();

        Set<Long> bookmarkedStoryIds = (userId != null)
                ? storyBookmarkRepository.findBookmarkedStoryIdsByUserIdAndStoryIds(userId, storyIds)
                : Collections.emptySet();

        return storySlice.map(story -> StoryResponse.of(
                story,
                likedStoryIds.contains(story.getId()),
                bookmarkedStoryIds.contains(story.getId())
        ));
    }
}
