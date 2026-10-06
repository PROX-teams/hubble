package com.hubble.graph.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "노드 그래프 연결선(Edge) 응답 DTO")
public record GraphLinkResponse(
        @Schema(description = "출발 노드 ID", example = "cat_DEVELOPMENT")
        String source,

        @Schema(description = "도착 노드 ID", example = "tag_React")
        String target,

        @Schema(description = "태그 둘이 함께 등장한 노트 수 (루트 링크는 null)", example = "35", nullable = true)
        Long coOccurrenceCount,

        @Schema(description = "태그 간 자카드 유사도 (루트 링크는 null)", example = "0.75", nullable = true)
        Double similarity
) {
}
