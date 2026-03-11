package com.hubble.story.repository;

import com.hubble.story.entity.Story;
import com.hubble.story.entity.StoryBookmark;
import com.hubble.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoryBookmarkRepository extends JpaRepository<StoryBookmark, Long> {
    Optional<StoryBookmark> findByUserAndStory(User user, Story story);
    long countByStory(Story story);
    boolean existsByUserAndStory(User user, Story story);
}
