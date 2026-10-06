package com.hubble.search.service;

import com.hubble.note.dto.StoryNoteCountDto;
import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.repository.NoteRepository;
import com.hubble.note.repository.NoteTagRepository;
import com.hubble.search.dto.response.SearchResponse;
import com.hubble.search.dto.response.SearchStoryResponse;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

    private final NoteRepository noteRepository;
    private final StoryRepository storyRepository;
    private final NoteTagRepository noteTagRepository;

    private static final int TAG_LIMIT = 10;

    public SearchResponse search(String keyword, Pageable pageable, boolean includeStories, boolean includeNotes) {
        boolean isSearching = StringUtils.hasText(keyword);
        String cleanKeyword = isSearching ? keyword.trim() : null;

        // 태그는 첫 페이지에만 노출하므로 추가 페이지에서는 집계를 반복하지 않는다.
        List<String> tags = pageable.getPageNumber() == 0
                ? (isSearching
                    ? noteTagRepository.searchTagNamesByKeyword(cleanKeyword, PageRequest.of(0, TAG_LIMIT))
                    : noteTagRepository.findPopularTagNames(PageRequest.of(0, TAG_LIMIT)))
                : Collections.emptyList();

        Slice<Story> storySlice = includeStories
                ? (isSearching
                    ? storyRepository.searchStoriesSlice(cleanKeyword, pageable)
                    : storyRepository.findPopularStoriesSlice(pageable))
                : new SliceImpl<>(Collections.emptyList(), pageable, false);
        Slice<SearchStoryResponse> storyResponses = toSearchStoryResponses(storySlice);

        Slice<Note> noteSlice = includeNotes
                ? noteRepository.searchNotesSlice(cleanKeyword, pageable)
                : new SliceImpl<>(Collections.emptyList(), pageable, false);
        Slice<NoteSummaryResponse> noteResponses = noteSlice.map(NoteSummaryResponse::from);

        return SearchResponse.of(isSearching, tags, storyResponses, noteResponses);
    }

    private Slice<SearchStoryResponse> toSearchStoryResponses(Slice<Story> storySlice) {
        List<Story> stories = storySlice.getContent();
        if (stories.isEmpty()) {
            return new SliceImpl<>(Collections.emptyList(), storySlice.getPageable(), storySlice.hasNext());
        }

        List<Long> storyIds = stories.stream().map(Story::getId).toList();
        Map<Long, Long> noteCounts = new HashMap<>();
        for (StoryNoteCountDto count : noteRepository.countNotesByStoryIds(storyIds)) {
            noteCounts.put(count.storyId(), count.noteCount());
        }

        return storySlice.map(story -> SearchStoryResponse.of(
                story, noteCounts.getOrDefault(story.getId(), 0L)));
    }
}
