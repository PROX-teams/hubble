package com.hubble.note.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "태그별 게시글 수 통계 응답")
public record TagCountResponse(
        @Schema(description = "태그 이름", example = "Frontend")
        String name,

        @Schema(description = "해당 태그가 포함된 게시글 수", example = "102")
        Long count
) {
}
