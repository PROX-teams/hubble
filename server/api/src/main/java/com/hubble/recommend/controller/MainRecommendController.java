package com.hubble.recommend.controller;

import com.hubble.recommend.dto.response.MainRecommendResponse;
import com.hubble.recommend.service.MainRecommendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Recommend API", description = "메인페이지 추천 알고리즘 API")
@RestController
@RequestMapping("/api/main/recommend")
@RequiredArgsConstructor
public class MainRecommendController {

    private final MainRecommendService mainRecommendService;

    @Operation(
            summary = "메인페이지 추천 데이터 조회",
            description = "Most Loved(인기 노트 12개), Discover(최근 트렌딩 탐색 노트 16개), Creators(인기 크리에이터 5명)를 한 번에 조회합니다."
    )
    @GetMapping
    public ResponseEntity<MainRecommendResponse> getRecommendations() {
        return ResponseEntity.ok(mainRecommendService.getRecommendations());
    }
}
