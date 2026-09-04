package com.hubble.story.repository;

import com.hubble.story.entity.Story;
import com.hubble.story.entity.StoryLike;
import com.hubble.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface StoryLikeRepository extends JpaRepository<StoryLike, Long> {
    Optional<StoryLike> findByUserAndStory(User user, Story story);
    Optional<StoryLike> findByUserIdAndStoryId(Long userId, Long storyId);
    boolean existsByUserIdAndStoryId(Long userId, Long storyId);
    void deleteByUserIdAndStoryId(Long userId, Long storyId);
    long countByStory(Story story);
    boolean existsByUserAndStory(User user, Story story);

    @Query("SELECT sl.story.id FROM StoryLike sl WHERE sl.user.id = :userId AND sl.story.id IN :storyIds")
    Set<Long> findLikedStoryIdsByUserIdAndStoryIds(@Param("userId") Long userId, @Param("storyIds") List<Long> storyIds);
}
