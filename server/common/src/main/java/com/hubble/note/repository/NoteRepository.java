package com.hubble.note.repository;

import com.hubble.common.entity.Category;
import com.hubble.note.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long>, NoteRepositoryCustom {

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Note n SET n.viewCount = n.viewCount + 1 WHERE n.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Note n SET n.likeCount = n.likeCount + 1 WHERE n.id = :id")
    void incrementLikeCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Note n SET n.likeCount = CASE WHEN n.likeCount > 0 THEN n.likeCount - 1 ELSE 0 END WHERE n.id = :id")
    void decrementLikeCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Note n SET n.bookmarkCount = n.bookmarkCount + 1 WHERE n.id = :id")
    void incrementBookmarkCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Note n SET n.bookmarkCount = CASE WHEN n.bookmarkCount > 0 THEN n.bookmarkCount - 1 ELSE 0 END WHERE n.id = :id")
    void decrementBookmarkCount(@Param("id") Long id);

    @Query("select n from Note n join fetch n.user order by n.likeCount desc")
    List<Note> findTop10ByOrderByLikeCountDescWithFetch(Pageable pageable);

    @Query("select n from Note n join fetch n.user order by n.viewCount desc")
    List<Note> findTop10ByOrderByViewCountDescWithFetch(Pageable pageable);

    // 로그인 사용자의 최근 업데이트 노트 이력 조회 (경량 DTO 프로젝션 및 Slice 무한스크롤 최적화)
    @Query("SELECT new com.hubble.note.dto.NoteHistoryDto(n.id, n.title, s.title, n.updatedAt) " +
           "FROM Note n LEFT JOIN n.story s " +
           "WHERE n.user.id = :userId " +
           "ORDER BY n.updatedAt DESC")
    org.springframework.data.domain.Slice<com.hubble.note.dto.NoteHistoryDto> findRecentUpdatesByUserId(@Param("userId") Long userId, Pageable pageable);

    // 로그인 사용자의 북마크한 노트 목록 조회 (Fetch Join 적용 및 페이징 N+1 완전 해결)
    @Query(value = "select n from NoteBookmark nb join nb.note n join fetch n.user where nb.user.id = :userId",
           countQuery = "select count(nb) from NoteBookmark nb where nb.user.id = :userId")
    Page<Note> findBookmarkedNotesByUserIdWithFetch(@Param("userId") Long userId, Pageable pageable);

    // 상위 스토리 조회수 비동기 롤업을 위한 storyId 단건 스칼라 조회 (조인 없는 Zero-Join 인덱스 스캔)
    @Query("SELECT n.story.id FROM Note n WHERE n.id = :id")
    Long findStoryIdByNoteId(@Param("id") Long id);
}
