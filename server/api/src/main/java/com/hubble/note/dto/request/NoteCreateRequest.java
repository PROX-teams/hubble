package com.hubble.note.dto.request;

import com.hubble.common.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Schema(description = "노트 생성 요청")
public record NoteCreateRequest(
        @Schema(description = "노트 제목", example = "나의 첫 번째 노트")
        @NotBlank(message = "TITLE_EMPTY")
        String title,

        @Schema(description = "노트 상세 설명(내용)", example = "이것은 노트의 상세 내용입니다.")
        @NotBlank(message = "CONTENT_EMPTY")
        String content,

        @Schema(description = "카테고리", example = "DEVELOPMENT")
        @NotNull(message = "CATEGORY_EMPTY")
        Category category,

        @Schema(description = "대표 이미지 URL", example = "https://example.com/image.png")
        String imageUrl,

        @Schema(description = "태그 리스트", example = "[\"Java\", \"Spring\"]")
        List<String> tag,

        @Schema(description = "포함할 스토리 ID (포함하지 않을 경우 기본 폴더에 저장)", example = "1")
        Long storyId
) {
}
