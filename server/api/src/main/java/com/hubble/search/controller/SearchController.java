package com.hubble.search.controller;

import com.hubble.search.dto.response.SearchResponse;
import com.hubble.search.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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
            description = "태그, 스토리, 노트를 조회합니다. 키워드가 없으면 인기 콘텐츠를 반환합니다. 태그는 첫 페이지에만 포함되며, includeStories/includeNotes로 끝난 목록의 추가 조회를 생략할 수 있습니다."
    )
    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "true") boolean includeStories,
            @RequestParam(defaultValue = "true") boolean includeNotes,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(searchService.search(keyword, pageable, includeStories, includeNotes));
    }
}
