package com.hubble.note.repository;

import com.hubble.common.entity.Category;
import com.hubble.note.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // 좋아요가 많은 순 Top 10
    List<Note> findTop10ByOrderByLikeCountDesc();

    // 조회수가 많은 순 Top 10
    List<Note> findTop10ByOrderByViewCountDesc();

    // 카테고리별 필터링 + 무한 스크롤
    Page<Note> findAllByCategory(Category category, Pageable pageable);

    // 검색 (제목 또는 내용) + 무한 스크롤
    Page<Note> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    // 전체 조회 (무한 스크롤용 - 정렬은 Pageable에서 처리)
    Page<Note> findAll(Pageable pageable);
}
