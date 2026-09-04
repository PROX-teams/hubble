package com.hubble.note.controller;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteHistoryResponse;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.note.dto.response.TagCountResponse;
import com.hubble.note.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Note API", description = "노트(글) 관리 API")
@RestController
@RequestMapping("/api/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @Operation(summary = "노트 생성", description = "새로운 노트를 생성합니다.")
    @PostMapping
    public ResponseEntity<NoteResponse> createNote(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody NoteCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.createNote(userId, request));
    }

    @Operation(summary = "노트 수정", description = "기존 노트를 수정합니다.")
    @PutMapping("/{noteId}")
    public ResponseEntity<NoteResponse> updateNote(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long noteId,
            @Valid @RequestBody NoteCreateRequest request) {
        return ResponseEntity.ok(noteService.updateNote(userId, noteId, request));
    }

    @Operation(summary = "노트 삭제", description = "노트를 삭제합니다.")
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long noteId) {
        noteService.deleteNote(userId, noteId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "노트 상세 조회", description = "특정 노트의 상세 정보를 조회합니다.")
    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponse> getNote(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long noteId) {
        return ResponseEntity.ok(noteService.getNote(noteId, userId));
    }

    @Operation(summary = "노트 목록 조회", description = "필터링(카테고리, 태그) 및 검색 기능을 포함한 노트 목록을 조회합니다. (무한 스크롤)")
    @GetMapping
    public ResponseEntity<Page<NoteSummaryResponse>> getNotes(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tagName,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(noteService.getNotes(category, keyword, tagName, pageable));
    }

    @Operation(summary = "북마크한 노트 목록 조회", description = "로그인한 사용자가 북마크한 노트 목록을 조회합니다.")
    @GetMapping("/bookmarks")
    public ResponseEntity<Page<NoteSummaryResponse>> getBookmarkedNotes(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(noteService.getBookmarkedNotes(userId, pageable));
    }

    @Operation(summary = "내가 작성한 노트 목록 조회", description = "로그인한 사용자가 작성한 노트 목록을 조회합니다. (태그 필터링 및 정렬 지원)")
    @GetMapping("/me")
    public ResponseEntity<Page<NoteSummaryResponse>> getMyNotes(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) String tagName,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(noteService.getUserNotes(userId, tagName, pageable));
    }

    @Operation(summary = "내가 작성한 노트의 최근 수정 이력 조회", description = "로그인한 사용자의 최근 수정된 노트 목록을 경량 DTO로 조회합니다. (Slice 무한스크롤 지원)")
    @GetMapping("/me/recent-updates")
    public ResponseEntity<Slice<NoteHistoryResponse>> getRecentUpdates(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(noteService.getRecentUpdates(userId, pageable));
    }

    @Operation(summary = "내가 작성한 노트의 태그 통계 조회", description = "로그인한 사용자가 작성한 노트들의 태그 목록과 각 태그별 게시글 수를 조회합니다.")
    @GetMapping("/me/tags")
    public ResponseEntity<List<TagCountResponse>> getMyTags(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(noteService.getUserTags(userId));
    }

    @Operation(summary = "특정 사용자의 노트 목록 조회", description = "특정 사용자가 작성한 공개 노트 목록을 조회합니다. (태그 필터링 및 정렬 지원)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NoteSummaryResponse>> getUserNotes(
            @PathVariable Long userId,
            @RequestParam(required = false) String tagName,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(noteService.getUserNotes(userId, tagName, pageable));
    }

    @Operation(summary = "특정 사용자의 태그 통계 조회", description = "특정 사용자가 작성한 노트들의 태그 목록과 각 태그별 게시글 수를 조회합니다.")
    @GetMapping("/user/{userId}/tags")
    public ResponseEntity<List<TagCountResponse>> getUserTags(
            @PathVariable Long userId) {
        return ResponseEntity.ok(noteService.getUserTags(userId));
    }

    @Operation(summary = "좋아요 많은 노트 Top 10", description = "좋아요를 가장 많이 받은 노트 10개를 조회합니다.")
    @GetMapping("/top10/like")
    public ResponseEntity<List<NoteSummaryResponse>> getTop10LikedNotes() {
        return ResponseEntity.ok(noteService.getTop10LikedNotes());
    }

    @Operation(summary = "조회수 많은 노트 Top 10", description = "조회수가 가장 높은 노트 10개를 조회합니다.")
    @GetMapping("/top10/view")
    public ResponseEntity<List<NoteSummaryResponse>> getTop10ViewedNotes() {
        return ResponseEntity.ok(noteService.getTop10ViewedNotes());
    }

    @Operation(summary = "노트 좋아요 토글", description = "노트에 좋아요를 누르거나 취소합니다.")
    @PostMapping("/{noteId}/like")
    public ResponseEntity<Void> toggleLike(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long noteId) {
        noteService.toggleLike(userId, noteId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "노트 북마크 토글", description = "노트를 북마크에 추가하거나 취소합니다.")
    @PostMapping("/{noteId}/bookmark")
    public ResponseEntity<Void> toggleBookmark(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long noteId) {
        noteService.toggleBookmark(userId, noteId);
        return ResponseEntity.ok().build();
    }
}
