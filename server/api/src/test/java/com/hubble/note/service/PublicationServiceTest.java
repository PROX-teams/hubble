package com.hubble.note.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.PublicationRequest;
import com.hubble.note.repository.PublicationRequestRepository;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;
class PublicationServiceTest {
    @Test
    void retryReturnsSameResponseWithoutCreatingAnotherNote() {
        UserRepository users = mock(UserRepository.class);
        PublicationRequestRepository requests = mock(PublicationRequestRepository.class);
        NoteService notes = mock(NoteService.class);
        ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
        PublicationService service = new PublicationService(users, requests, notes, mapper);
        User user = User.builder().id(1L).build();
        when(users.findById(1L)).thenReturn(Optional.of(user));
        PublicationRequest reserved = PublicationRequest.builder().userId(1L).requestKey("ABC")
                .payloadHash("pending").responseJson("{}").build();
        when(requests.findForUpdate(1L, "ABC")).thenReturn(Optional.of(reserved));
        var payload = new NoteCreateRequest("title", "body", Category.DEVELOPMENT, null, List.of(), null);
        var response = NoteResponse.of(Note.builder().id(123L).user(user).title("title")
                .content("body").category(Category.DEVELOPMENT).build(), false, false);
        when(notes.createNote(1L, payload)).thenReturn(response);
        when(requests.saveAndFlush(any())).thenAnswer(i -> {
            PublicationRequest saved = i.getArgument(0);
            when(requests.findForUpdate(1L, "ABC")).thenReturn(Optional.of(saved));
            return saved;
        });
        assertThat(service.publish(1L, "ABC", payload)).isEqualTo(response);
        assertThat(service.publish(1L, "ABC", payload)).isEqualTo(response);
        verify(notes, times(1)).createNote(1L, payload);
        assertThatThrownBy(() -> service.publish(1L, "ABC",
                new NoteCreateRequest("different", "body", Category.DEVELOPMENT, null, List.of(), null)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(notes, times(1)).createNote(anyLong(), any());
    }
    @Test
    void missingKeyDoesNotCreateNote() {
        NoteService notes = mock(NoteService.class);
        var service = new PublicationService(mock(UserRepository.class), mock(PublicationRequestRepository.class), notes, new ObjectMapper());
        assertThatThrownBy(() -> service.publish(1L, null, null))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verifyNoInteractions(notes);
    }
}
