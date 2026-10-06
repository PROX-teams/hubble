package com.hubble.note.repository;

import com.hubble.note.entity.Draft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DraftRepository extends JpaRepository<Draft, Long> {

    List<Draft> findByUserIdAndPublishedFalseOrderByUpdatedAtDesc(Long userId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM Draft d WHERE d.id = :id AND d.user.id = :userId")
    Optional<Draft> findOwnedForUpdate(@Param("id") Long id, @Param("userId") Long userId);

    Optional<Draft> findByIdAndUserId(Long id, Long userId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Draft d WHERE d.id = :id AND d.user.id = :userId AND d.published = false")
    int deleteByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Draft d WHERE d.user.id = :userId AND d.published = false")
    int deleteAllByUserId(@Param("userId") Long userId);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Draft d SET d.storyId = :targetId, d.version = d.version + 1, " +
           "d.updatedAt = CURRENT_TIMESTAMP WHERE d.user.id = :userId AND d.storyId = :sourceId AND d.published = false")
    int moveStoryDrafts(@Param("sourceId") Long sourceId, @Param("targetId") Long targetId,
                        @Param("userId") Long userId);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Draft d SET d.noteId = null, d.baseNoteVersion = null, " +
           "d.version = d.version + 1, d.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE d.noteId = :noteId AND d.user.id = :userId AND d.published = false")
    int preserveDeletedNoteDrafts(@Param("noteId") Long noteId, @Param("userId") Long userId);

    long countByUserId(Long userId);
}
