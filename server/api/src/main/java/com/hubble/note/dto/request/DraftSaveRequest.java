package com.hubble.note.dto.request;

import com.hubble.common.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "임시저장 생성/수정 요청 DTO")
public record DraftSaveRequest(
        @Schema(description = "기존 임시저장 ID (신규 저장 시 null)", example = "1")
        Long id,

        @Schema(description = "수정 대상 게시글 ID; 새 글 초안이면 null")
        Long noteId,

        @Schema(description = "수정을 시작한 게시글 버전")
        Long baseNoteVersion,

        @Schema(description = "노트 제목", example = "작성 중인 리액트 19 정리")
        String title,

        @Schema(description = "노트 본문 HTML/Markdown", example = "<p>작성 중인 내용...</p>")
        String content,

        @Schema(description = "카테고리", example = "DEVELOPMENT")
        Category category,

        @Schema(description = "스토리 ID", example = "1")
        Long storyId,

        @Schema(description = "태그 목록", example = "[\"React\", \"Next.js\"]")
        List<String> tags,

        @Schema(description = "대표 이미지 URL", example = "https://example.com/image.png")
        String imageUrl,

        @Schema(description = "조회 시 받은 초안 버전; 기존 초안 저장 시 필수")
        Long version
) {
    public DraftSaveRequest(Long id, Long noteId, String title, String content, Category category,
                            Long storyId, List<String> tags, String imageUrl, Long version) {
        this(id, noteId, null, title, content, category, storyId, tags, imageUrl, version);
    }

    public DraftSaveRequest(Long id, Long noteId, String title, String content, Category category,
                            Long storyId, List<String> tags, String imageUrl) {
        this(id, noteId, null, title, content, category, storyId, tags, imageUrl, null);
    }
}
