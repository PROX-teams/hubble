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
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoryService {

    private final StoryRepository storyRepository;
    private final StoryLikeRepository storyLikeRepository;
    private final StoryBookmarkRepository storyBookmarkRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;

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
        storyRepository.incrementViewCount(storyId);
        
        Story story = getStoryEntity(storyId);
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return StoryResponse.of(story, isLiked(user, story), isBookmarked(user, story));
    }

    public Page<StoryResponse> getStories(Category category, String keyword, Pageable pageable, Long userId) {
        Page<Story> stories;
        if (category != null) {
            stories = storyRepository.findAllByCategoryWithFetch(category, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            stories = storyRepository.findByKeywordWithFetch(keyword, pageable);
        } else {
            stories = storyRepository.findAllWithFetch(pageable);
        }

        return convertToStoryResponses(stories, userId);
    }

    public Page<StoryResponse> getBookmarkedStories(Long userId, Pageable pageable) {
        User user = getUserEntity(userId);
        Page<StoryBookmark> bookmarks = storyBookmarkRepository.findAllByUser(user, pageable);
        List<Story> stories = bookmarks.map(StoryBookmark::getStory).getContent();

        List<Long> storyIds = stories.stream().map(Story::getId).toList();
        Set<Long> likedStoryIds = (!storyIds.isEmpty())
                ? storyLikeRepository.findLikedStoryIdsByUserIdAndStoryIds(userId, storyIds)
                : Collections.emptySet();

        List<StoryResponse> responses = stories.stream()
                .map(story -> StoryResponse.of(story, likedStoryIds.contains(story.getId()), true))
                .toList();

        return new PageImpl<>(responses, pageable, bookmarks.getTotalElements());
    }

    public Page<StoryResponse> getMyStories(Long userId, Pageable pageable) {
        getUserEntity(userId); // 유저 검증
        Page<Story> stories = storyRepository.findAllByUserIdWithFetch(userId, pageable);
        return convertToStoryResponses(stories, userId);
    }

    public List<StoryResponse> getTop10LikedStories(Long userId) {
        List<Story> stories = storyRepository.findTop10ByOrderByLikeCountDescWithFetch(PageRequest.of(0, 10));
        return convertToStoryResponses(stories, userId);
    }

    // 🚀 [최적화 3] 원자적 증감 쿼리 및 getReference 프록시 적용 (SELECT 0건 Zero-I/O 및 불필요한 엔티티 조회 제거)
    @Transactional
    public void toggleLike(Long userId, Long storyId) {
        if (storyLikeRepository.existsByUserIdAndStoryId(userId, storyId)) {
            storyLikeRepository.deleteByUserIdAndStoryId(userId, storyId);
            storyRepository.decrementLikeCount(storyId);
        } else {
            User userRef = entityManager.getReference(User.class, userId);
            Story storyRef = entityManager.getReference(Story.class, storyId);
            storyLikeRepository.saveAndFlush(StoryLike.builder().user(userRef).story(storyRef).build());
            storyRepository.incrementLikeCount(storyId);
        }
    }

    // 🚀 [최적화 3] 원자적 증감 쿼리 및 getReference 프록시 적용 (SELECT 0건 Zero-I/O 및 불필요한 엔티티 조회 제거)
    @Transactional
    public void toggleBookmark(Long userId, Long storyId) {
        if (storyBookmarkRepository.existsByUserIdAndStoryId(userId, storyId)) {
            storyBookmarkRepository.deleteByUserIdAndStoryId(userId, storyId);
            storyRepository.decrementBookmarkCount(storyId);
        } else {
            User userRef = entityManager.getReference(User.class, userId);
            Story storyRef = entityManager.getReference(Story.class, storyId);
            storyBookmarkRepository.saveAndFlush(StoryBookmark.builder().user(userRef).story(storyRef).build());
            storyRepository.incrementBookmarkCount(storyId);
        }
    }

    // 🚀 [최적화 핵심] N+1 방지를 위한 IN 쿼리 배치 매핑 공통 헬퍼 메서드 (Page)
    private Page<StoryResponse> convertToStoryResponses(Page<Story> storyPage, Long userId) {
        List<Story> stories = storyPage.getContent();
        List<StoryResponse> responses = convertToStoryResponses(stories, userId);
        return new PageImpl<>(responses, storyPage.getPageable(), storyPage.getTotalElements());
    }

    // 🚀 [최적화 핵심] N+1 방지를 위한 IN 쿼리 배치 매핑 공통 헬퍼 메서드 (List)
    private List<StoryResponse> convertToStoryResponses(List<Story> stories, Long userId) {
        if (stories == null || stories.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> storyIds = stories.stream().map(Story::getId).toList();

        // IN 쿼리 2회로 현재 페이지에 속한 모든 스토리의 좋아요/북마크 상태 일괄 조회 (O(1) Set)
        Set<Long> likedStoryIds = (userId != null)
                ? storyLikeRepository.findLikedStoryIdsByUserIdAndStoryIds(userId, storyIds)
                : Collections.emptySet();

        Set<Long> bookmarkedStoryIds = (userId != null)
                ? storyBookmarkRepository.findBookmarkedStoryIdsByUserIdAndStoryIds(userId, storyIds)
                : Collections.emptySet();

        return stories.stream()
                .map(story -> StoryResponse.of(
                        story,
                        likedStoryIds.contains(story.getId()),
                        bookmarkedStoryIds.contains(story.getId())
                ))
                .toList();
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
        if (user == null || user.getId() == null || story == null || story.getId() == null) return false;
        return storyLikeRepository.existsByUserAndStory(user, story);
    }

    private boolean isBookmarked(User user, Story story) {
        if (user == null || user.getId() == null || story == null || story.getId() == null) return false;
        return storyBookmarkRepository.existsByUserAndStory(user, story);
    }
}
