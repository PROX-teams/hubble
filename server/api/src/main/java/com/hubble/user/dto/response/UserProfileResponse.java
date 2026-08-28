package com.hubble.user.dto.response;

import com.hubble.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "사용자 프로필 정보 응답")
public record UserProfileResponse(
        @Schema(description = "사용자 ID", example = "1")
        Long id,

        @Schema(description = "이메일", example = "user@example.com")
        String email,

        @Schema(description = "닉네임", example = "감자")
        String nickname
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname()
        );
    }
}
