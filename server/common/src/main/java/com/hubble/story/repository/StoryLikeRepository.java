package com.hubble.story.repository;

import com.hubble.story.entity.Story;
import com.hubble.story.entity.StoryLike;
import com.hubble.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoryLikeRepository extends JpaRepository<StoryLike, Long> {
    Optional<StoryLike> findByUserAndStory(User user, Story story);
    long countByStory(Story story);
    boolean existsByUserAndStory(User user, Story story);
}
