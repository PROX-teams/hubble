package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.repository.NoteBookmarkRepository;
import com.hubble.note.repository.NoteLikeRepository;
import com.hubble.note.repository.NoteRepository;
import com.hubble.note.repository.NoteTagRepository;
import com.hubble.note.repository.TagRepository;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import com.hubble.story.service.StoryService;
import com.hubble.user.entity.ProviderType;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @InjectMocks
    private NoteService noteService;

    @Mock
    private NoteRepository noteRepository;
    @Mock
    private NoteLikeRepository noteLikeRepository;
    @Mock
    private NoteBookmarkRepository noteBookmarkRepository;
    @Mock
    private TagRepository tagRepository;
    @Mock
    private NoteTagRepository noteTagRepository;
    @Mock
    private StoryRepository storyRepository;
    @Mock
    private StoryService storyService;
    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("노트 생성 시 스토리가 없으면 기본 폴더가 자동으로 생성되어야 한다.")
    void createNoteWithDefaultStory() {
        // given
        Long userId = 1L;
        User user = new User("test@test.com", "password", "nickname", ProviderType.EMAIL);
        Story defaultStory = Story.builder().id(1L).title("기본 폴더").user(user).build();
        NoteCreateRequest request = new NoteCreateRequest("제목", "내용", Category.DEVELOPMENT, "imgUrl", List.of("Tag1"), null);

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(storyService.getOrCreateDefaultStory(user)).willReturn(defaultStory);
        given(noteRepository.save(any(Note.class))).willAnswer(invocation -> invocation.getArgument(0));

        // when
        NoteResponse response = noteService.createNote(userId, request);

        // then
        assertThat(response.title()).isEqualTo("제목");
        assertThat(response.storyId()).isEqualTo(1L);
        verify(storyService, times(1)).getOrCreateDefaultStory(user);
        verify(noteRepository, times(1)).save(any(Note.class));
    }

    @Test
    @DisplayName("노트 생성 시 태그가 정상적으로 저장되어야 한다.")
    void createNoteWithTags() {
        // given
        Long userId = 1L;
        User user = new User("test@test.com", "password", "nickname", ProviderType.EMAIL);
        Story story = Story.builder().id(1L).title("전용 폴더").user(user).build();
        List<String> tags = List.of("Java", "Spring");
        NoteCreateRequest request = new NoteCreateRequest("제목", "내용", Category.DEVELOPMENT, "imgUrl", tags, 1L);

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(storyRepository.findById(1L)).willReturn(Optional.of(story));
        given(noteRepository.save(any(Note.class))).willAnswer(invocation -> invocation.getArgument(0));
        given(tagRepository.findByName(any())).willReturn(Optional.empty());

        // when
        noteService.createNote(userId, request);

        // then
        verify(tagRepository, times(2)).save(any()); // 태그가 2개이므로 2번 호출되어야 함
        verify(noteTagRepository, times(2)).save(any());
    }
}
