package com.hubble.story.dto.request;

import com.hubble.common.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "스토리 생성 요청")
public record StoryCreateRequest(
        @Schema(description = "스토리 제목", example = "나의 전공 지식 정리")
        @NotBlank(message = "TITLE_EMPTY")
        String title,

        @Schema(description = "스토리 설명", example = "내가 배운 지식들을 정리한 폴더")
        String description,

        @Schema(description = "카테고리", example = "DEVELOPMENT")
        @NotNull(message = "CATEGORY_EMPTY")
        Category category,

        @Schema(description = "스토리 아이콘", example = "folder-icon")
        String icon
) {
}
