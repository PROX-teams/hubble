package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.DraftSaveRequest;
import com.hubble.note.entity.Draft;
import com.hubble.note.entity.Note;
import com.hubble.note.repository.DraftRepository;
import com.hubble.note.repository.NoteRepository;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DraftServiceTest {
    @Mock DraftRepository draftRepository;
    @Mock UserRepository userRepository;
    @Mock NoteRepository noteRepository;
    @InjectMocks DraftService service;

    @Test
    void savingEditDraftLeavesPublishedContentUntouched() {
        User user = User.builder().id(1L).build();
        Note note = Note.builder().id(10L).user(user).title("public title").content("public body").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(noteRepository.findById(10L)).thenReturn(Optional.of(note));
        when(draftRepository.saveAndFlush(any())).thenAnswer(i -> i.getArgument(0));
        var response = service.saveDraft(1L, new DraftSaveRequest(null, 10L, "draft title", "draft body",
                Category.DEVELOPMENT, null, List.of(), null));
        assertThat(response.noteId()).isEqualTo(10L);
        assertThat(note.getContent()).isEqualTo("public body");
        verify(noteRepository, never()).save(any());
    }

    @Test
    void delayedSaveCannotResurrectPublishedDraft() {
        User user = User.builder().id(1L).build();
        Draft draft = Draft.builder().id(5L).user(user).build();
        draft.markPublished(10L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(draftRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(draft));
        assertThatThrownBy(() -> service.saveDraft(1L, new DraftSaveRequest(5L, null, "old", "old",
                Category.DEVELOPMENT, null, List.of(), null))).isInstanceOf(IllegalArgumentException.class);
        verify(draftRepository, never()).saveAndFlush(any());
    }

    @Test
    void missingOrForeignDraftDoesNotCreateReplacement() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(User.builder().id(1L).build()));
        when(draftRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.saveDraft(1L, new DraftSaveRequest(5L, null, "title", "body",
                Category.DEVELOPMENT, null, List.of(), null))).isInstanceOf(IllegalArgumentException.class);
        verify(draftRepository, never()).saveAndFlush(any());
    }

    @Test
    void staleVersionCannotOverwriteLatestContent() {
        User user = User.builder().id(1L).build();
        Draft draft = Draft.builder().id(5L).user(user).version(4L).content("latest body").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(draftRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(draft));
        assertThatThrownBy(() -> service.saveDraft(1L, new DraftSaveRequest(5L, null, "old", "old body",
                Category.DEVELOPMENT, null, List.of(), null, 3L)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThat(draft.getContent()).isEqualTo("latest body");
        verify(draftRepository, never()).saveAndFlush(any());
    }

    @Test
    void matchingVersionReturnsFlushedVersion() {
        User user = User.builder().id(1L).build();
        Draft draft = Draft.builder().id(5L).user(user).version(4L).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(draftRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(draft));
        when(draftRepository.saveAndFlush(draft)).thenReturn(
                Draft.builder().id(5L).user(user).version(5L).content("new body").build());
        var response = service.saveDraft(1L, new DraftSaveRequest(5L, null, "new", "new body",
                Category.DEVELOPMENT, null, List.of(), null, 4L));
        assertThat(response.version()).isEqualTo(5L);
        assertThat(draft.getContent()).isEqualTo("new body");
    }

    @Test
    void existingDraftRequiresVersion() {
        User user = User.builder().id(1L).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(draftRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(
                Draft.builder().id(5L).user(user).version(0L).build()));
        assertThatThrownBy(() -> service.saveDraft(1L, new DraftSaveRequest(5L, null, "new", "body",
                Category.DEVELOPMENT, null, List.of(), null)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(draftRepository, never()).saveAndFlush(any());
    }
}
