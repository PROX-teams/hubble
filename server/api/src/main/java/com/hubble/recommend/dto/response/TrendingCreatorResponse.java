package com.hubble.recommend.dto.response;

import com.hubble.user.dto.TrendingCreatorDto;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "인기 크리에이터 응답 DTO")
public record TrendingCreatorResponse(
        @Schema(description = "사용자 ID", example = "1")
        Long userId,

        @Schema(description = "크리에이터 닉네임", example = "PROX 팀블로그")
        String name,

        @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.png")
        String imageUrl,

        @Schema(description = "소개 문구", example = "총 12개의 노트를 발행한 크리에이터입니다.")
        String introduction,

        @Schema(description = "작성한 공개 노트 수", example = "12")
        long noteCount,

        @Schema(description = "받은 총 좋아요 수", example = "150")
        long totalLikes
) {
    public static TrendingCreatorResponse from(TrendingCreatorDto dto) {
        return new TrendingCreatorResponse(
                dto.userId(),
                dto.nickname(),
                null,
                String.format("총 %d개의 노트를 발행한 크리에이터입니다.", dto.noteCount()),
                dto.noteCount(),
                dto.totalLikes()
        );
    }
}
