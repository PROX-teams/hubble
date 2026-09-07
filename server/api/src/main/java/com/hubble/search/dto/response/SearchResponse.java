package com.hubble.search.dto.response;

import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.story.dto.response.StoryResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Slice;

import java.util.List;

@Schema(description = "통합 검색 응답 DTO (태그, 스토리, 노트)")
public record SearchResponse(
        @Schema(description = "검색어 입력 여부 (true: 검색 결과, false: 추천/인기 콘텐츠)", example = "true")
        boolean isSearching,

        @Schema(description = "태그 목록 (검색 연관 태그 또는 추천 인기 태그)", example = "[\"Next.js\", \"React\", \"TypeScript\"]")
        List<String> tags,

        @Schema(description = "스토리 무한 스크롤 Slice 응답")
        Slice<StoryResponse> stories,

        @Schema(description = "노트 무한 스크롤 Slice 응답")
        Slice<NoteSummaryResponse> notes
) {
    public static SearchResponse of(
            boolean isSearching,
            List<String> tags,
            Slice<StoryResponse> stories,
            Slice<NoteSummaryResponse> notes
    ) {
        return new SearchResponse(isSearching, tags, stories, notes);
    }
}
