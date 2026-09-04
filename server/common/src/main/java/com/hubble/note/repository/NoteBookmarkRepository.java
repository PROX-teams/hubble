package com.hubble.note.repository;

import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteBookmark;
import com.hubble.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface NoteBookmarkRepository extends JpaRepository<NoteBookmark, Long> {
    Optional<NoteBookmark> findByUserAndNote(User user, Note note);
    Optional<NoteBookmark> findByUserIdAndNoteId(Long userId, Long noteId);
    boolean existsByUserIdAndNoteId(Long userId, Long noteId);
    void deleteByUserIdAndNoteId(Long userId, Long noteId);
    long countByNoteId(Long noteId);
    long countByNote(Note note);
    boolean existsByUserAndNote(User user, Note note);
    
    // 사용자가 북마크한 노트 목록 조회 (최신순 등 정렬은 Pageable에서 처리)
    Page<NoteBookmark> findAllByUser(User user, Pageable pageable);
    Page<NoteBookmark> findAllByUserId(Long userId, Pageable pageable);

    @Query("SELECT nb.note.id FROM NoteBookmark nb WHERE nb.user.id = :userId AND nb.note.id IN :noteIds")
    Set<Long> findBookmarkedNoteIdsByUserIdAndNoteIds(@Param("userId") Long userId, @Param("noteIds") List<Long> noteIds);
}
