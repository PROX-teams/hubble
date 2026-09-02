package com.hubble.note.repository;

import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteLike;
import com.hubble.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteLikeRepository extends JpaRepository<NoteLike, Long> {
    Optional<NoteLike> findByUserAndNote(User user, Note note);
    Optional<NoteLike> findByUserIdAndNoteId(Long userId, Long noteId);
    boolean existsByUserIdAndNoteId(Long userId, Long noteId);
    void deleteByUserIdAndNoteId(Long userId, Long noteId);
    long countByNoteId(Long noteId);
    long countByNote(Note note);
    boolean existsByUserAndNote(User user, Note note);
}
