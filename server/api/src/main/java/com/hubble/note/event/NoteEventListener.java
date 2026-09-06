package com.hubble.note.event;

import com.hubble.note.repository.NoteBookmarkRepository;
import com.hubble.note.repository.NoteLikeRepository;
import com.hubble.note.repository.NoteRepository;
import com.hubble.story.repository.StoryRepository;
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
    private final NoteBookmarkRepository noteBookmarkRepository;
    private final NoteLikeRepository noteLikeRepository;
    private final StoryRepository storyRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION, fallbackExecution = true)
    public void handleNoteViewedEvent(NoteViewedEvent event) {
        if (event.noteId() == null) return;
        try {
            noteRepository.incrementViewCount(event.noteId());
            Long storyId = noteRepository.findStoryIdByNoteId(event.noteId());
            if (storyId != null) {
                storyRepository.incrementViewCount(storyId);
            }
        } catch (Exception e) {
            log.error("비동기 조회수 증가 실패: noteId={}", event.noteId(), e);
        }
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void handleNoteDeletedEvent(NoteDeletedEvent event) {
        if (event.noteId() == null) return;
        try {
            noteBookmarkRepository.deleteAllByNoteId(event.noteId());
            noteLikeRepository.deleteAllByNoteId(event.noteId());
            log.info("비동기 연관 데이터 정리 완료: noteId={}", event.noteId());
        } catch (Exception e) {
            log.error("비동기 연관 데이터 정리 실패: noteId={}", event.noteId(), e);
        }
    }
}
