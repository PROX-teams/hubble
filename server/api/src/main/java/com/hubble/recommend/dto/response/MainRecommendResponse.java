package com.hubble.recommend.dto.response;

import com.hubble.note.dto.response.NoteSummaryResponse;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "메인페이지 종합 추천 API 응답 DTO")
public record MainRecommendResponse(
        @Schema(description = "Most Loved 종합 인기 노트 목록 (12개)")
        List<NoteSummaryResponse> mostLovedNotes,

        @Schema(description = "Discover 최신 트렌딩 및 신규 탐색 노트 목록 (16개)")
        List<NoteSummaryResponse> discoverNotes,

        @Schema(description = "주목받는 크리에이터 목록 (5명)")
        List<TrendingCreatorResponse> creators
) {
    public static MainRecommendResponse of(
            List<NoteSummaryResponse> mostLovedNotes,
            List<NoteSummaryResponse> discoverNotes,
            List<TrendingCreatorResponse> creators
    ) {
        return new MainRecommendResponse(mostLovedNotes, discoverNotes, creators);
    }
}
