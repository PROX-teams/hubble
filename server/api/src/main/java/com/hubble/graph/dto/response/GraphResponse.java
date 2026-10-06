package com.hubble.graph.dto.response;

import com.hubble.common.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "노드 그래프 통합 응답 DTO")
public record GraphResponse(
        @Schema(description = "조회된 카테고리", example = "DEVELOPMENT")
        Category category,

        @Schema(description = "1레벨 중심(루트) 카테고리 노드")
        GraphNodeResponse rootNode,

        @Schema(description = "초기 화면의 대표 태그 목록")
        List<GraphNodeResponse> nodes,

        @Schema(description = "노드 간 연결선(링크) 목록")
        List<GraphLinkResponse> links,

        @Schema(description = "표시할 태그가 없는지 여부", example = "false")
        boolean isEmpty
) {
    public static GraphResponse empty(Category category, GraphNodeResponse rootNode) {
        return new GraphResponse(category, rootNode, List.of(), List.of(), true);
    }
}
