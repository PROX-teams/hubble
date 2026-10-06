package com.hubble.search.service;

import com.hubble.note.entity.Note;
import com.hubble.note.dto.StoryNoteCountDto;
import com.hubble.note.repository.NoteRepository;
import com.hubble.note.repository.NoteTagRepository;
import com.hubble.search.dto.response.SearchResponse;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import com.hubble.user.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.SliceImpl;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @InjectMocks
    private SearchService searchService;

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private NoteTagRepository noteTagRepository;

    @Mock
    private StoryRepository storyRepository;

    @Test
    void firstPageReturnsOnlyTheStoryFieldsUsedBySearch() {
        Pageable pageable = PageRequest.of(0, 10);
        Story story = Story.builder()
                .id(1L)
                .title("Spring Security")
                .user(User.builder().nickname("작성자").build())
                .build();
        given(noteTagRepository.searchTagNamesByKeyword("Spring", PageRequest.of(0, 10)))
                .willReturn(List.of("Spring"));
        given(storyRepository.searchStoriesSlice("Spring", pageable))
                .willReturn(new SliceImpl<>(List.of(story), pageable, false));
        given(noteRepository.countNotesByStoryIds(List.of(1L)))
                .willReturn(List.of(new StoryNoteCountDto(1L, 7L)));
        given(noteRepository.searchNotesSlice("Spring", pageable))
                .willReturn(new SliceImpl<>(List.<Note>of(), pageable, false));

        SearchResponse result = searchService.search(" Spring ", pageable, true, true);

        assertThat(result.isSearching()).isTrue();
        assertThat(result.tags()).containsExactly("Spring");
        assertThat(result.stories().getContent()).singleElement().satisfies(item -> {
            assertThat(item.id()).isEqualTo(1L);
            assertThat(item.title()).isEqualTo("Spring Security");
            assertThat(item.author()).isEqualTo("작성자");
            assertThat(item.noteCount()).isEqualTo(7);
        });
    }

    @Test
    void nextPageSkipsFinishedStoriesAndTagAggregation() {
        Pageable pageable = PageRequest.of(1, 10);
        given(noteRepository.searchNotesSlice("Spring", pageable))
                .willReturn(new SliceImpl<>(List.<Note>of(), pageable, false));

        SearchResponse result = searchService.search("Spring", pageable, false, true);

        assertThat(result.tags()).isEmpty();
        assertThat(result.stories().getContent()).isEmpty();
        assertThat(result.stories().isLast()).isTrue();
        verifyNoInteractions(noteTagRepository, storyRepository);
    }
}
