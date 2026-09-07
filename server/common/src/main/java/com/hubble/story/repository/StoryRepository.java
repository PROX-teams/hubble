package com.hubble.story.repository;

import com.hubble.common.entity.Category;
import com.hubble.story.entity.Story;
import com.hubble.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Story s SET s.viewCount = s.viewCount + 1 WHERE s.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Story s SET s.likeCount = s.likeCount + 1 WHERE s.id = :id")
    void incrementLikeCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Story s SET s.likeCount = CASE WHEN s.likeCount > 0 THEN s.likeCount - 1 ELSE 0 END WHERE s.id = :id")
    void decrementLikeCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Story s SET s.bookmarkCount = s.bookmarkCount + 1 WHERE s.id = :id")
    void incrementBookmarkCount(@Param("id") Long id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Story s SET s.bookmarkCount = CASE WHEN s.bookmarkCount > 0 THEN s.bookmarkCount - 1 ELSE 0 END WHERE s.id = :id")
    void decrementBookmarkCount(@Param("id") Long id);

    @Query(value = "select s from Story s join fetch s.user",
           countQuery = "select count(s) from Story s")
    Page<Story> findAllWithFetch(Pageable pageable);

    @Query(value = "select s from Story s join fetch s.user where s.category = :category",
           countQuery = "select count(s) from Story s where s.category = :category")
    Page<Story> findAllByCategoryWithFetch(@Param("category") Category category, Pageable pageable);

    @Query(value = "select s from Story s join fetch s.user where s.title like %:keyword% or s.description like %:keyword%",
           countQuery = "select count(s) from Story s where s.title like %:keyword% or s.description like %:keyword%")
    Page<Story> findByKeywordWithFetch(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "select s from Story s join fetch s.user where s.user.id = :userId",
           countQuery = "select count(s) from Story s where s.user.id = :userId")
    Page<Story> findAllByUserIdWithFetch(@Param("userId") Long userId, Pageable pageable);

    @Query("select s from Story s join fetch s.user order by s.likeCount desc")
    List<Story> findTop10ByOrderByLikeCountDescWithFetch(Pageable pageable);

    @Query("SELECT s FROM Story s JOIN FETCH s.user " +
           "WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(s.user.nickname) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY " +
           "  CASE WHEN LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 1 ELSE 2 END ASC, " +
           "  (s.bookmarkCount * 5 + s.likeCount * 3 + s.viewCount / 10) DESC, " +
           "  s.createdAt DESC")
    Slice<Story> searchStoriesSlice(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s FROM Story s JOIN FETCH s.user " +
           "ORDER BY (s.bookmarkCount * 5 + s.likeCount * 3 + s.viewCount / 10) DESC, s.createdAt DESC")
    Slice<Story> findPopularStoriesSlice(Pageable pageable);

    Optional<Story> findByTitleAndUser(String title, User user);
}
