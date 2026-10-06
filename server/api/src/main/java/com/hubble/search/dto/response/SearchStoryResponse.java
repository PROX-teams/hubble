package com.hubble.search.dto.response;

import com.hubble.story.entity.Story;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "통합 검색 목록에 필요한 스토리 요약")
public record SearchStoryResponse(
        @Schema(description = "스토리 ID")
        Long id,
        @Schema(description = "스토리 제목")
        String title,
        @Schema(description = "작성자 닉네임")
        String author,
        @Schema(description = "스토리에 속한 노트 개수")
        long noteCount
) {
    public static SearchStoryResponse of(Story story, long noteCount) {
        return new SearchStoryResponse(
                story.getId(),
                story.getTitle(),
                story.getUser().getNickname(),
                noteCount
        );
    }
}
