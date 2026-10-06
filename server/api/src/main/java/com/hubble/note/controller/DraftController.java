package com.hubble.note.controller;

import com.hubble.note.dto.request.DraftSaveRequest;
import com.hubble.note.dto.response.DraftResponse;
import com.hubble.note.service.DraftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Draft API", description = "노트 임시저장(초안) 관리 API")
@RestController
@RequestMapping("/api/draft")
@RequiredArgsConstructor
public class DraftController {

    private final DraftService draftService;

    @Operation(summary = "임시저장 생성/수정", description = "작성 중인 노트를 백엔드 DB에 임시저장(Autosave 포함)합니다.")
    @PostMapping
    public ResponseEntity<DraftResponse> saveDraft(
            @AuthenticationPrincipal Long userId,
            @RequestBody DraftSaveRequest request) {
        return ResponseEntity.ok(draftService.saveDraft(userId, request));
    }

    @Operation(summary = "내 임시저장 목록 조회", description = "로그인한 사용자의 임시저장 목록을 최신 수정순으로 조회합니다.")
    @GetMapping
    public ResponseEntity<List<DraftResponse>> getDrafts(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(draftService.getDrafts(userId));
    }

    @Operation(summary = "임시저장 상세 조회", description = "특정 임시저장 노트의 본문과 메타데이터를 조회합니다.")
    @GetMapping("/{draftId}")
    public ResponseEntity<DraftResponse> getDraft(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long draftId) {
        return ResponseEntity.ok(draftService.getDraft(userId, draftId));
    }

    @Operation(summary = "임시저장 단건 삭제", description = "특정 임시저장 노트를 삭제합니다.")
    @DeleteMapping("/{draftId}")
    public ResponseEntity<Void> deleteDraft(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long draftId) {
        draftService.deleteDraft(userId, draftId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "임시저장 전체 삭제", description = "로그인한 사용자의 모든 임시저장 노트를 삭제합니다.")
    @DeleteMapping
    public ResponseEntity<Void> clearAllDrafts(
            @AuthenticationPrincipal Long userId) {
        draftService.clearAllDrafts(userId);
        return ResponseEntity.noContent().build();
    }
}
