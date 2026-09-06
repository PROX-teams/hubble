package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.dto.response.NoteSummaryResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
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
    @Mock
    private org.springframework.context.ApplicationEventPublisher eventPublisher;
    @Mock
    private jakarta.persistence.EntityManager entityManager;

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
        given(tagRepository.findAllByNameIn(anyList())).willReturn(List.of());

        // when
        noteService.createNote(userId, request);

        // then
        verify(tagRepository, times(1)).saveAll(anyList());
        verify(noteTagRepository, times(1)).saveAll(anyList());
    }

    @Test
    @DisplayName("내가 작성한 노트 목록을 조회할 수 있어야 한다.")
    void getMyNotes() {
        // given
        Long userId = 1L;
        User user = User.builder().id(userId).email("test@test.com").build();
        Note note = Note.builder().id(1L).title("제목").user(user).category(Category.DEVELOPMENT).build();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Note> notePage = new PageImpl<>(List.of(note), pageable, 1);

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(noteRepository.searchNotes(any(com.hubble.note.dto.NoteSearchCondition.class), any(Pageable.class))).willReturn(notePage);

        // when
        Page<NoteSummaryResponse> response = noteService.getUserNotes(userId, null, pageable);

        // then
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).title()).isEqualTo("제목");
        verify(noteRepository, times(1)).searchNotes(any(com.hubble.note.dto.NoteSearchCondition.class), any(Pageable.class));
    }

    @Test
    @DisplayName("노트 삭제 시 부모 노트가 소프트 삭제되고 삭제 이벤트가 발행되어야 한다.")
    void deleteNoteWithAssociatedBookmarksAndLikes() {
        // given
        Long userId = 1L;
        Long noteId = 100L;
        User user = User.builder().id(userId).email("test@test.com").build();
        Note note = Note.builder().id(noteId).title("제목").user(user).category(Category.DEVELOPMENT).build();

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(noteRepository.findById(noteId)).willReturn(Optional.of(note));

        // when
        noteService.deleteNote(userId, noteId);

        // then
        verify(noteRepository, times(1)).delete(note);
        verify(eventPublisher, times(1)).publishEvent(any(com.hubble.note.event.NoteDeletedEvent.class));
    }
}
