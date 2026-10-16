package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.graph.service.GraphChangeRecorder;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.entity.*;
import com.hubble.note.repository.*;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import com.hubble.story.service.StoryService;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class NoteUpdateFlowTest {
    private final DraftRepository drafts = mock(DraftRepository.class);
    private final NoteRepository notes = mock(NoteRepository.class);
    private final NoteTagRepository links = mock(NoteTagRepository.class);
    private final TagRepository tags = mock(TagRepository.class);
    private final StoryService stories = mock(StoryService.class);
    private final UserRepository users = mock(UserRepository.class);
    private final EntityManager entities = mock(EntityManager.class);
    private final GraphChangeRecorder events = mock(GraphChangeRecorder.class);
    private final NoteService service = new NoteService(drafts, notes,
            mock(NoteLikeRepository.class), mock(NoteBookmarkRepository.class), tags, links,
            mock(StoryRepository.class), stories, users, mock(ApplicationEventPublisher.class), entities, events);
    private final User user = User.builder().id(1L).nickname("author").build();
    private final Story story = Story.builder().id(20L).user(user).build();
    private final Note note = Note.builder().id(10L).user(user).story(story)
            .category(Category.DEVELOPMENT).contentVersion(4L).build();

    private void prepare() {
        when(users.findById(1L)).thenReturn(Optional.of(user));
        when(notes.findById(10L)).thenReturn(Optional.of(note));
        when(notes.findByIdForUpdate(10L)).thenReturn(Optional.of(note));
        when(stories.getOwnedStoryForReference(1L, 20L)).thenReturn(story);
    }

    private NoteCreateRequest request(Long draftId, Long version) {
        return new NoteCreateRequest("edited", "body", Category.DESIGN, null,
                List.of("jpa"), null, draftId, 2L, version);
    }

    @Test
    void replacesTagsSavesDetachedDraftAndReturnsReloadedTagsInOrder() {
        prepare();
        Draft draft = Draft.builder().id(30L).noteId(10L).baseNoteVersion(4L).version(2L).build();
        Tag tag = Tag.builder().id(3L).name("jpa").build();
        Note refreshed = Note.builder().id(10L).user(user).story(story).title("edited")
                .category(Category.DESIGN).contentVersion(5L)
                .noteTags(List.of(NoteTag.builder().tag(tag).build())).build();
        when(drafts.findOwnedForUpdate(30L, 1L)).thenReturn(Optional.of(draft));
        when(links.findTagIdsByNoteId(10L)).thenReturn(List.of(1L, 2L));
        when(tags.findResolvedForUpdate("jpa")).thenReturn(Optional.of(tag));
        when(notes.findById(10L)).thenReturn(Optional.of(note), Optional.of(refreshed));

        var response = service.updateNote(1L, 10L, request(30L, 4L));

        assertThat(response.tag()).containsExactly("jpa");
        assertThat(response.version()).isEqualTo(5L);
        assertThat(draft.isPublished()).isTrue();
        var order = inOrder(stories, entities, drafts, notes, links, tags, events);
        order.verify(stories).getOwnedStoryForReference(1L, 20L);
        order.verify(entities).detach(note);
        order.verify(drafts).findOwnedForUpdate(30L, 1L);
        order.verify(notes).findByIdForUpdate(10L);
        order.verify(links).findTagIdsByNoteId(10L);
        order.verify(tags).findByName("jpa");
        order.verify(tags).insertIfAbsent("jpa");
        order.verify(links).deleteLink(10L, 1L);
        order.verify(links).deleteLink(10L, 2L);
        order.verify(links).saveAll(org.mockito.ArgumentMatchers.anyList());
        order.verify(events).record(10L, Category.DEVELOPMENT, List.of(1L, 2L), Category.DESIGN, List.of(3L));
        order.verify(drafts).save(draft);
        order.verify(entities).flush();
        order.verify(entities).clear();
        order.verify(notes).findById(10L);
    }

    @Test
    void staleVersionCannotChangeTagsOrRecordEvent() {
        prepare();
        assertThatThrownBy(() -> service.updateNote(1L, 10L, request(null, 3L)))
                .isInstanceOf(ResponseStatusException.class);
        assertThat(note.getContentVersion()).isEqualTo(4L);
        verifyNoInteractions(links, tags, events);
        verify(entities, never()).clear();
    }

    @Test
    void publishedDraftReturnsExistingResponseWithoutRepeatingUpdate() {
        prepare();
        Draft draft = Draft.builder().id(30L).noteId(10L).published(true).build();
        when(drafts.findOwnedForUpdate(30L, 1L)).thenReturn(Optional.of(draft));
        service.updateNote(1L, 10L, request(30L, 4L));
        verify(notes, never()).findByIdForUpdate(10L);
        verifyNoInteractions(links, tags, events);
        verify(drafts, never()).save(org.mockito.ArgumentMatchers.any());
    }
}
