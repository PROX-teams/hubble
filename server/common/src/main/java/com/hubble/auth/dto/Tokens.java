package com.hubble.auth.dto;

import com.hubble.auth.entity.RefreshToken;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 로그인 성공 시 발급되는 Access Token과 Refresh Token의 묶음 객체
 */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Tokens {

    private final String accessToken;
    private final RefreshToken refreshToken;

    public static Tokens of(String accessToken, RefreshToken refreshToken) {
        return new Tokens(accessToken, refreshToken);
    }
}
