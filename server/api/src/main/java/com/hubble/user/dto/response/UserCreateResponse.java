package com.hubble.user.dto.response;

import com.hubble.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원가입 성공 응답")
public record UserCreateResponse(
        @Schema(description = "사용자 ID", example = "1")
        Long id,

        @Schema(description = "사용자 이메일", example = "mimi@icloud.com")
        String email,

        @Schema(description = "사용자 닉네임", example = "mimi")
        String nickname
) {
    public static UserCreateResponse from(User user) {
        return new UserCreateResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname()
        );
    }
}
