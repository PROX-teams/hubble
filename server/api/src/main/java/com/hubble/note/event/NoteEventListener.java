package com.hubble.note.event;

import com.hubble.note.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class NoteEventListener {

    private final NoteRepository noteRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION, fallbackExecution = true)
    public void handleNoteViewedEvent(NoteViewedEvent event) {
        if (event.noteId() == null) return;
        try {
            noteRepository.incrementViewCount(event.noteId());
        } catch (Exception e) {
            log.error("비동기 조회수 증가 실패: noteId={}", event.noteId(), e);
        }
    }
}
