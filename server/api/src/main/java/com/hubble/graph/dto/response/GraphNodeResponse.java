package com.hubble.graph.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "노드 그래프 단일 노드 응답 DTO")
public record GraphNodeResponse(
        @Schema(description = "노드 고유 ID", example = "tag_React")
        String id,

        @Schema(description = "노드 표시 명칭(태그명/카테고리명)", example = "React")
        String name,

        @Schema(description = "탐색 화면에서의 깊이 (1: 카테고리, 2 이상: 태그)", example = "2")
        int level,

        @Schema(description = "카테고리 노트 수 또는 태그 사용 노트 수", example = "42")
        long usageCount,

        @Schema(description = "상위 부모 노드 ID (1레벨은 null)", example = "cat_DEVELOPMENT")
        String parentId
) {
}
