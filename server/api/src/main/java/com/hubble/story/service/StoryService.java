package com.hubble.story.service;

import com.hubble.common.entity.Category;
import com.hubble.story.dto.request.StoryCreateRequest;
import com.hubble.story.dto.response.StoryResponse;
import com.hubble.story.entity.Story;
import com.hubble.story.entity.StoryBookmark;
import com.hubble.story.entity.StoryLike;
import com.hubble.story.repository.StoryBookmarkRepository;
import com.hubble.story.repository.StoryLikeRepository;
import com.hubble.story.repository.StoryRepository;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoryService {

    private final StoryRepository storyRepository;
    private final StoryLikeRepository storyLikeRepository;
    private final StoryBookmarkRepository storyBookmarkRepository;
    private final UserRepository userRepository;

    private static final String DEFAULT_STORY_TITLE = "기본 폴더";

    @Transactional
    public StoryResponse createStory(Long userId, StoryCreateRequest request) {
        User user = getUserEntity(userId);
        Story story = Story.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .icon(request.icon())
                .user(user)
                .viewCount(0)
                .likeCount(0)
                .bookmarkCount(0)
                .build();

        Story savedStory = storyRepository.save(story);
        return StoryResponse.of(savedStory, false, false);
    }

    @Transactional
    public Story getOrCreateDefaultStory(User user) {
        return storyRepository.findByTitleAndUser(DEFAULT_STORY_TITLE, user)
                .orElseGet(() -> storyRepository.save(Story.builder()
                        .title(DEFAULT_STORY_TITLE)
                        .description("기본으로 생성된 폴더입니다.")
                        .category(Category.OTHER)
                        .user(user)
                        .build()));
    }

    @Transactional
    public StoryResponse updateStory(Long userId, Long storyId, StoryCreateRequest request) {
        User user = getUserEntity(userId);
        Story story = getStoryEntity(storyId);
        validateOwner(user, story);

        story.update(request.title(), request.description(), request.category(), request.icon());
        return StoryResponse.of(story, isLiked(user, story), isBookmarked(user, story));
    }

    @Transactional
    public void deleteStory(Long userId, Long storyId) {
        User user = getUserEntity(userId);
        Story story = getStoryEntity(storyId);
        validateOwner(user, story);
        storyRepository.delete(story);
    }

    @Transactional
    public StoryResponse getStory(Long storyId, Long userId) {
        Story story = getStoryEntity(storyId);
        story.incrementViewCount();
        
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return StoryResponse.of(story, isLiked(user, story), isBookmarked(user, story));
    }

    public Page<StoryResponse> getStories(Category category, String keyword, Pageable pageable, Long userId) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        Page<Story> stories;
        if (category != null) {
            stories = storyRepository.findAllByCategory(category, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            stories = storyRepository.findByTitleContainingOrDescriptionContaining(keyword, keyword, pageable);
        } else {
            stories = storyRepository.findAll(pageable);
        }

        return stories.map(story -> StoryResponse.of(story, isLiked(user, story), isBookmarked(user, story)));
    }

    public List<StoryResponse> getTop10LikedStories(Long userId) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return storyRepository.findTop10ByOrderByLikeCountDesc().stream()
                .map(story -> StoryResponse.of(story, isLiked(user, story), isBookmarked(user, story)))
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleLike(Long userId, Long storyId) {
        User user = getUserEntity(userId);
        Story story = getStoryEntity(storyId);
        storyLikeRepository.findByUserAndStory(user, story)
                .ifPresentOrElse(
                        like -> {
                            storyLikeRepository.delete(like);
                            story.updateLikeCount(story.getLikeCount() - 1);
                        },
                        () -> {
                            storyLikeRepository.save(StoryLike.builder().user(user).story(story).build());
                            story.updateLikeCount(story.getLikeCount() + 1);
                        }
                );
    }

    @Transactional
    public void toggleBookmark(Long userId, Long storyId) {
        User user = getUserEntity(userId);
        Story story = getStoryEntity(storyId);
        storyBookmarkRepository.findByUserAndStory(user, story)
                .ifPresentOrElse(
                        bookmark -> {
                            storyBookmarkRepository.delete(bookmark);
                            story.updateBookmarkCount(story.getBookmarkCount() - 1);
                        },
                        () -> {
                            storyBookmarkRepository.save(StoryBookmark.builder().user(user).story(story).build());
                            story.updateBookmarkCount(story.getBookmarkCount() + 1);
                        }
                );
    }

    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    private Story getStoryEntity(Long storyId) {
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 스토리입니다."));
    }

    private void validateOwner(User user, Story story) {
        if (!story.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("해당 스토리에 대한 권한이 없습니다.");
        }
    }

    private boolean isLiked(User user, Story story) {
        if (user == null) return false;
        return storyLikeRepository.existsByUserAndStory(user, story);
    }

    private boolean isBookmarked(User user, Story story) {
        if (user == null) return false;
        return storyBookmarkRepository.existsByUserAndStory(user, story);
    }
}
