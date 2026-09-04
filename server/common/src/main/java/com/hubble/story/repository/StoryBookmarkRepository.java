package com.hubble.story.repository;

import com.hubble.story.entity.Story;
import com.hubble.story.entity.StoryBookmark;
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
public interface StoryBookmarkRepository extends JpaRepository<StoryBookmark, Long> {
    Optional<StoryBookmark> findByUserAndStory(User user, Story story);
    Optional<StoryBookmark> findByUserIdAndStoryId(Long userId, Long storyId);
    boolean existsByUserIdAndStoryId(Long userId, Long storyId);
    void deleteByUserIdAndStoryId(Long userId, Long storyId);
    long countByStory(Story story);
    boolean existsByUserAndStory(User user, Story story);
    
    // 사용자가 북마크한 스토리 목록 조회
    Page<StoryBookmark> findAllByUser(User user, Pageable pageable);
    Page<StoryBookmark> findAllByUserId(Long userId, Pageable pageable);

    @Query("SELECT sb.story.id FROM StoryBookmark sb WHERE sb.user.id = :userId AND sb.story.id IN :storyIds")
    Set<Long> findBookmarkedStoryIdsByUserIdAndStoryIds(@Param("userId") Long userId, @Param("storyIds") List<Long> storyIds);
}
