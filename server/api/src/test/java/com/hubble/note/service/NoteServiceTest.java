package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.graph.service.GraphChangeRecorder;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.Tag;
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
    private com.hubble.note.repository.DraftRepository draftRepository;
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

    @Mock
    private GraphChangeRecorder graphChangeRecorder;

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
        given(tagRepository.saveAll(anyList())).willReturn(List.of(Tag.builder().id(1L).name("Tag1").build()));

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
        given(tagRepository.saveAll(anyList())).willReturn(List.of(
                Tag.builder().id(1L).name("Java").build(),
                Tag.builder().id(2L).name("Spring").build()));

        // when
        noteService.createNote(userId, request);

        // then
        verify(tagRepository, times(1)).saveAll(anyList());
        verify(noteTagRepository, times(1)).saveAll(anyList());
    }

    @Test
    @DisplayName("노트 수정 시 스토리를 생략해도 기존 소속이 유지된다.")
    void updateNoteKeepsExistingStory() {
        User user = User.builder().id(1L).nickname("작성자").build();
        Story story = Story.builder().id(10L).title("기존 폴더").user(user).build();
        Note note = Note.builder().id(100L).title("제목").content("내용")
                .category(Category.DEVELOPMENT).user(user).story(story).build();
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(noteRepository.findByIdForUpdate(100L)).willReturn(Optional.of(note));
        given(noteRepository.findById(100L)).willReturn(Optional.of(note));

        NoteResponse response = noteService.updateNote(1L, 100L,
                new NoteCreateRequest("수정", "수정 내용", Category.DEVELOPMENT, null, List.of(), null));

        assertThat(note.getStory()).isSameAs(story);
        assertThat(response.storyId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("소속이 없는 기존 노트는 수정 시 기본 폴더에 배치된다.")
    void updateLegacyNoteAssignsDefaultStory() {
        User user = User.builder().id(1L).nickname("작성자").build();
        Story story = Story.builder().id(10L).title("기본 폴더").user(user).build();
        Note note = Note.builder().id(100L).title("제목").content("내용")
                .category(Category.DEVELOPMENT).user(user).build();
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(noteRepository.findByIdForUpdate(100L)).willReturn(Optional.of(note));
        given(noteRepository.findById(100L)).willReturn(Optional.of(note));
        given(storyService.getOrCreateDefaultStory(user)).willReturn(story);

        NoteResponse response = noteService.updateNote(1L, 100L,
                new NoteCreateRequest("수정", "수정 내용", Category.DEVELOPMENT, null, List.of(), null));

        assertThat(note.getStory()).isSameAs(story);
        assertThat(response.storyId()).isEqualTo(10L);
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
        given(noteRepository.findByIdForUpdate(noteId)).willReturn(Optional.of(note));

        // when
        noteService.deleteNote(userId, noteId);

        // then
        verify(noteRepository, times(1)).delete(note);
        verify(eventPublisher, times(1)).publishEvent(any(com.hubble.note.event.NoteDeletedEvent.class));
    }

    @Test
    void publishDraftUsesLatestContentAndMarksCompleted() {
        User user = User.builder().id(1L).build();
        Story story = Story.builder().id(10L).user(user).build();
        var draft = com.hubble.note.entity.Draft.builder().id(5L).version(0L).user(user)
                .title("old").content("old").build();
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.of(draft));
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(storyService.getOrCreateDefaultStory(user)).willReturn(story);
        given(noteRepository.save(any(Note.class))).willAnswer(invocation -> {
            Note submitted = invocation.getArgument(0);
            return Note.builder().id(100L).user(user).story(story).title(submitted.getTitle())
                    .content(submitted.getContent()).category(submitted.getCategory()).build();
        });
        var result = noteService.createNote(1L,
                new NoteCreateRequest("latest", "latest body", Category.DEVELOPMENT, null, List.of(), null, 5L));
        assertThat(result.title()).isEqualTo("latest");
        assertThat(draft.isPublished()).isTrue();
        assertThat(draft.getNoteId()).isEqualTo(100L);
        verify(draftRepository).save(draft);
    }

    @Test
    void repeatedPublicationReturnsExistingNote() {
        User user = User.builder().id(1L).build();
        Note note = Note.builder().id(100L).user(user).title("published")
                .content("body").category(Category.DEVELOPMENT).build();
        var draft = com.hubble.note.entity.Draft.builder().id(5L).version(0L).user(user).build();
        draft.markPublished(100L);
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.of(draft));
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(noteRepository.findById(100L)).willReturn(Optional.of(note));
        var result = noteService.createNote(1L,
                new NoteCreateRequest("retry", "retry body", Category.DEVELOPMENT, null, List.of(), null, 5L));
        assertThat(result.id()).isEqualTo(100L);
        verify(noteRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void editingDraftCannotCreateAnotherNote() {
        var draft = com.hubble.note.entity.Draft.builder().id(5L).noteId(100L).baseNoteVersion(0L).build();
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.of(draft));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> noteService.createNote(1L,
                new NoteCreateRequest("title", "body", Category.DEVELOPMENT, null, List.of(), null, 5L)))
                .isInstanceOf(IllegalArgumentException.class);
        verify(noteRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void publishingEditDraftUpdatesExistingNoteAndCompletesDraft() {
        User user = User.builder().id(1L).build();
        Story story = Story.builder().id(10L).user(user).build();
        Note note = Note.builder().id(100L).user(user).story(story).title("public")
                .content("public body").category(Category.DEVELOPMENT).build();
        var draft = com.hubble.note.entity.Draft.builder().id(5L).version(0L).user(user).noteId(100L).baseNoteVersion(0L).build();
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.of(draft));
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(noteRepository.findByIdForUpdate(100L)).willReturn(Optional.of(note));
        given(noteRepository.findById(100L)).willReturn(Optional.of(note));
        var result = noteService.updateNote(1L, 100L,
                new NoteCreateRequest("edited", "edited body", Category.DEVELOPMENT, null, List.of(), null, 5L));
        assertThat(result.id()).isEqualTo(100L);
        assertThat(result.description()).isEqualTo("edited body");
        assertThat(draft.isPublished()).isTrue();
        verify(draftRepository).save(draft);
        verify(noteRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void inaccessibleDraftCannotBePublished() {
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.empty());
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> noteService.createNote(1L,
                new NoteCreateRequest("title", "body", Category.DEVELOPMENT, null, List.of(), null, 5L)))
                .isInstanceOf(IllegalArgumentException.class);
        verify(noteRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void staleDraftCannotPublish() {
        var draft = com.hubble.note.entity.Draft.builder().id(5L).version(4L).build();
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.of(draft));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> noteService.createNote(1L,
                new NoteCreateRequest("title", "body", Category.DEVELOPMENT, null, List.of(), null, 5L, 3L, null)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(noteRepository, org.mockito.Mockito.never()).save(any());
        assertThat(draft.isPublished()).isFalse();
    }

    @Test
    void stalePublishedVersionCannotBeOverwrittenWithoutDraft() {
        User user = User.builder().id(1L).build();
        Note note = Note.builder().id(100L).user(user).contentVersion(4L).content("latest").build();
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(noteRepository.findByIdForUpdate(100L)).willReturn(Optional.of(note));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> noteService.updateNote(1L, 100L,
                new NoteCreateRequest("title", "old", Category.DEVELOPMENT, null, List.of(), null, null, null, 3L)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThat(note.getContent()).isEqualTo("latest");
        verify(noteTagRepository, org.mockito.Mockito.never()).deleteAllByNote(any());
    }

    @Test
    void editingDraftRetainsOriginalPublishedBaseline() {
        User user = User.builder().id(1L).build();
        Note note = Note.builder().id(100L).user(user).contentVersion(4L).content("latest").build();
        var draft = com.hubble.note.entity.Draft.builder().id(5L).version(2L).noteId(100L)
                .baseNoteVersion(3L).build();
        given(draftRepository.findOwnedForUpdate(5L, 1L)).willReturn(Optional.of(draft));
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(noteRepository.findByIdForUpdate(100L)).willReturn(Optional.of(note));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> noteService.updateNote(1L, 100L,
                new NoteCreateRequest("title", "old", Category.DEVELOPMENT, null, List.of(), null, 5L, 2L, 4L)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThat(draft.isPublished()).isFalse();
        assertThat(note.getContent()).isEqualTo("latest");
    }
}
