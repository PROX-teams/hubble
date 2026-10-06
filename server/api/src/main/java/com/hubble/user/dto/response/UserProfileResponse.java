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
        String nickname,

        @Schema(description = "직무/역할", example = "Software Engineer")
        String role,

        @Schema(description = "자기소개", example = "React와 TypeScript 기반 프론트엔드 개발자입니다.")
        String bio,

        @Schema(description = "깃허브 주소", example = "https://github.com/example")
        String githubUrl
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole(),
                user.getBio(),
                user.getGithubUrl()
        );
    }
}
