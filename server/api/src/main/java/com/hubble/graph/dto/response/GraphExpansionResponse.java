package com.hubble.graph.dto.response;

import com.hubble.common.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "선택한 태그의 주변 탐색 결과")
public record GraphExpansionResponse(
        Category category,
        String centerTag,
        List<GraphNodeResponse> nodes,
        List<GraphLinkResponse> links,
        boolean hasMore
) {
}
