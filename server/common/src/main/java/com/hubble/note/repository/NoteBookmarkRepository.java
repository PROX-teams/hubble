package com.hubble.note.repository;

import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteBookmark;
import com.hubble.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteBookmarkRepository extends JpaRepository<NoteBookmark, Long> {
    Optional<NoteBookmark> findByUserAndNote(User user, Note note);
    long countByNote(Note note);
    boolean existsByUserAndNote(User user, Note note);
    
    // 사용자가 북마크한 노트 목록 조회 (최신순 등 정렬은 Pageable에서 처리)
    Page<NoteBookmark> findAllByUser(User user, Pageable pageable);
}
