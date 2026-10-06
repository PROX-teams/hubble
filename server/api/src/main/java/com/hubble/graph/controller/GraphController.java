package com.hubble.graph.controller;

import com.hubble.common.entity.Category;
import com.hubble.graph.dto.response.GraphResponse;
import com.hubble.graph.dto.response.GraphExpansionResponse;
import com.hubble.graph.service.GraphService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Tag(name = "Graph API", description = "노트 지식 그래프 시각화 API")
@RestController
@RequestMapping("/api/graph")
@RequiredArgsConstructor
public class GraphController {

    private final GraphService graphService;

    @Operation(
            summary = "카테고리별 노드 그래프 데이터 조회",
            description = "카테고리 시작 노드와 대표 태그를 조회합니다. 연관 태그는 /neighbors API로 단계적으로 탐색합니다."
    )
    @GetMapping
    public ResponseEntity<GraphResponse> getGraph(
            @RequestParam(required = false, defaultValue = "DEVELOPMENT") Category category
    ) {
        return ResponseEntity.ok(graphService.getGraphData(category));
    }

    @Operation(summary = "태그 주변 노드 확장", description = "선택한 태그와 같은 노트에 등장한 연관 태그를 유사도순으로 반환합니다.")
    @GetMapping("/neighbors")
    public ResponseEntity<GraphExpansionResponse> getNeighbors(
            @RequestParam(required = false, defaultValue = "DEVELOPMENT") Category category,
            @RequestParam String tagName,
            @RequestParam(required = false) List<String> exclude,
            @RequestParam(required = false, defaultValue = "6") int limit
    ) {
        return ResponseEntity.ok(graphService.expandTag(category, tagName, exclude, limit));
    }
}
