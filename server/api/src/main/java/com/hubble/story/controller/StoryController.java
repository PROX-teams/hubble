package com.hubble.story.controller;

import com.hubble.common.entity.Category;
import com.hubble.story.dto.request.StoryCreateRequest;
import com.hubble.story.dto.response.StoryResponse;
import com.hubble.story.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Story API", description = "스토리(폴더) 관리 API")
@RestController
@RequestMapping("/api/story")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @Operation(summary = "스토리 생성", description = "새로운 스토리를 생성합니다.")
    @PostMapping
    public ResponseEntity<StoryResponse> createStory(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody StoryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storyService.createStory(userId, request));
    }

    @Operation(summary = "스토리 수정", description = "기존 스토리를 수정합니다.")
    @PutMapping("/{storyId}")
    public ResponseEntity<StoryResponse> updateStory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long storyId,
            @Valid @RequestBody StoryCreateRequest request) {
        return ResponseEntity.ok(storyService.updateStory(userId, storyId, request));
    }

    @Operation(summary = "스토리 삭제", description = "스토리를 삭제합니다.")
    @DeleteMapping("/{storyId}")
    public ResponseEntity<Void> deleteStory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long storyId) {
        storyService.deleteStory(userId, storyId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "스토리 상세 조회", description = "특정 스토리의 상세 정보를 조회합니다.")
    @GetMapping("/{storyId}")
    public ResponseEntity<StoryResponse> getStory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long storyId) {
        return ResponseEntity.ok(storyService.getStory(storyId, userId));
    }

    @Operation(summary = "스토리 목록 조회", description = "필터링 및 검색 기능을 포함한 스토리 목록을 조회합니다. (무한 스크롤)")
    @GetMapping
    public ResponseEntity<Page<StoryResponse>> getStories(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(storyService.getStories(category, keyword, pageable, userId));
    }

    @Operation(summary = "좋아요 많은 스토리 Top 10", description = "좋아요를 가장 많이 받은 스토리 10개를 조회합니다.")
    @GetMapping("/top10")
    public ResponseEntity<List<StoryResponse>> getTop10LikedStories(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(storyService.getTop10LikedStories(userId));
    }

    @Operation(summary = "스토리 좋아요 토글", description = "스토리에 좋아요를 누르거나 취소합니다.")
    @PostMapping("/{storyId}/like")
    public ResponseEntity<Void> toggleLike(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long storyId) {
        storyService.toggleLike(userId, storyId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "스토리 북마크 토글", description = "스토리를 북마크에 추가하거나 취소합니다.")
    @PostMapping("/{storyId}/bookmark")
    public ResponseEntity<Void> toggleBookmark(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long storyId) {
        storyService.toggleBookmark(userId, storyId);
        return ResponseEntity.ok().build();
    }
}
