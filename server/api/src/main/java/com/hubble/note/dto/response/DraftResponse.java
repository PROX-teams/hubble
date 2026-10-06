package com.hubble.note.dto.response;

import com.hubble.common.entity.Category;
import com.hubble.note.entity.Draft;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Schema(description = "임시저장 응답 DTO")
public record DraftResponse(
        @Schema(description = "임시저장 ID", example = "1")
        Long id,

        @Schema(description = "초안 버전")
        Long version,

        @Schema(description = "수정 대상 게시글 ID; 새 글 초안이면 null")
        Long noteId,

        @Schema(description = "수정을 시작한 게시글 버전")
        Long baseNoteVersion,

        @Schema(description = "노트 제목", example = "작성 중인 글")
        String title,

        @Schema(description = "노트 본문", example = "<p>본문...</p>")
        String content,

        @Schema(description = "카테고리", example = "DEVELOPMENT")
        Category category,

        @Schema(description = "스토리 ID", example = "1")
        Long storyId,

        @Schema(description = "태그 목록")
        List<String> tags,

        @Schema(description = "대표 이미지 URL")
        String imageUrl,

        @Schema(description = "최종 저장 일시")
        LocalDateTime savedAt
) {
    public static DraftResponse from(Draft draft) {
        List<String> tagList = List.of();
        if (draft.getTags() != null && !draft.getTags().isBlank()) {
            tagList = Arrays.stream(draft.getTags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }

        return new DraftResponse(
                draft.getId(),
                draft.getVersion(),
                draft.getNoteId(),
                draft.getBaseNoteVersion(),
                draft.getTitle(),
                draft.getContent(),
                draft.getCategory(),
                draft.getStoryId(),
                tagList,
                draft.getImageUrl(),
                draft.getUpdatedAt() != null ? draft.getUpdatedAt() : LocalDateTime.now()
        );
    }
}
