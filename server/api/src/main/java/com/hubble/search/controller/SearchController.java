package com.hubble.search.controller;

import com.hubble.search.dto.response.SearchResponse;
import com.hubble.search.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Search API", description = "통합 검색 API")
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @Operation(
            summary = "통합 검색 (태그, 스토리, 노트)",
            description = "태그, 스토리, 노트를 한 번에 조회하는 통합 검색 API입니다. 키워드가 없으면 인기 콘텐츠를 반환하며, Slice 기반 무한 스크롤을 지원합니다."
    )
    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(searchService.search(keyword, pageable, userId));
    }
}
