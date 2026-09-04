package com.hubble.note.repository;

import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteLike;
import com.hubble.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface NoteLikeRepository extends JpaRepository<NoteLike, Long> {
    Optional<NoteLike> findByUserAndNote(User user, Note note);
    Optional<NoteLike> findByUserIdAndNoteId(Long userId, Long noteId);
    boolean existsByUserIdAndNoteId(Long userId, Long noteId);
    void deleteByUserIdAndNoteId(Long userId, Long noteId);
    long countByNoteId(Long noteId);
    long countByNote(Note note);
    boolean existsByUserAndNote(User user, Note note);

    @Query("SELECT nl.note.id FROM NoteLike nl WHERE nl.user.id = :userId AND nl.note.id IN :noteIds")
    Set<Long> findLikedNoteIdsByUserIdAndNoteIds(@Param("userId") Long userId, @Param("noteIds") List<Long> noteIds);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM NoteLike nl WHERE nl.note.id = :noteId")
    void deleteAllByNoteId(@Param("noteId") Long noteId);
}
