package com.hubble.note.repository;

import com.hubble.common.entity.Category;
import com.hubble.note.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Note n SET n.viewCount = n.viewCount + 1 WHERE n.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Note n SET n.likeCount = n.likeCount + 1 WHERE n.id = :id")
    void incrementLikeCount(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Note n SET n.likeCount = n.likeCount - 1 WHERE n.id = :id")
    void decrementLikeCount(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Note n SET n.bookmarkCount = n.bookmarkCount + 1 WHERE n.id = :id")
    void incrementBookmarkCount(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Note n SET n.bookmarkCount = n.bookmarkCount - 1 WHERE n.id = :id")
    void decrementBookmarkCount(@Param("id") Long id);

    @Query(value = "select n from Note n join fetch n.user left join fetch n.story",
           countQuery = "select count(n) from Note n")
    Page<Note> findAllWithFetch(Pageable pageable);

    @Query(value = "select n from Note n join fetch n.user left join fetch n.story where n.category = :category",
           countQuery = "select count(n) from Note n where n.category = :category")
    Page<Note> findAllByCategoryWithFetch(@Param("category") Category category, Pageable pageable);

    @Query(value = "select n from Note n join fetch n.user left join fetch n.story where n.title like %:keyword% or n.content like %:keyword%",
           countQuery = "select count(n) from Note n where n.title like %:keyword% or n.content like %:keyword%")
    Page<Note> findByKeywordWithFetch(@Param("keyword") String keyword, Pageable pageable);

    // 태그 이름으로 필터링 (ManyToOne fetch join 적용)
    @Query(value = "select distinct n from Note n join fetch n.user left join fetch n.story join n.noteTags nt join nt.tag t where t.name = :tagName",
           countQuery = "select count(distinct n) from Note n join n.noteTags nt join nt.tag t where t.name = :tagName")
    Page<Note> findAllByTagNameWithFetch(@Param("tagName") String tagName, Pageable pageable);

    @Query("select n from Note n join fetch n.user left join fetch n.story order by n.likeCount desc")
    List<Note> findTop10ByOrderByLikeCountDescWithFetch(Pageable pageable);

    @Query("select n from Note n join fetch n.user left join fetch n.story order by n.viewCount desc")
    List<Note> findTop10ByOrderByViewCountDescWithFetch(Pageable pageable);
}
