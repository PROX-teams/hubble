package com.hubble.auth.service;

import com.hubble.auth.dto.request.LoginRequest;
import com.hubble.auth.dto.response.LoginResponse;
import com.hubble.auth.entity.EmailVerification;
import com.hubble.auth.entity.RefreshToken;
import com.hubble.auth.repository.EmailVerificationRepository;
import com.hubble.auth.repository.RefreshTokenRepository;
import com.hubble.auth.security.JwtTokenProvider;
import com.hubble.user.entity.ProviderType;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void sendVerificationEmail(String email) {
        // 1. 기존 인증 정보 삭제
        emailVerificationRepository.deleteByEmail(email);

        // 2. 6자리 인증 코드 생성
        String code = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(5); // 5분 유효

        // 3. 인증 정보 저장
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiryDate(expiryDate)
                .build();
        emailVerificationRepository.save(verification);

        // 4. 이메일 발송 (현재는 로그로 대체)
        log.info("이메일 인증 코드 발송: [{}], Code: [{}]", email, code);
        // TODO: JavaMailSender 연동 시 실제 메일 발송 로직 추가
    }

    @Transactional
    public void verifyEmail(String email, String code) {
        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("인증 정보가 존재하지 않습니다."));

        if (!verification.verify(code)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // ... 기존 코드 생략 (아래에 전체 포함)
        User user = userRepository.findByEmailAndProviderType(request.getEmail(), ProviderType.EMAIL)
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일이거나 비밀번호가 일치하지 않습니다."));

        if (!user.checkPassword(request.getPassword(), passwordEncoder)) {
            throw new IllegalArgumentException("가입되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getId());
        String refreshTokenValue = jwtTokenProvider.createRefreshToken(user.getId());

        saveRefreshToken(user.getId(), refreshTokenValue);

        return LoginResponse.of(accessToken, refreshTokenValue, user);
    }

    @Transactional
    public LoginResponse reissue(String refreshTokenValue) {
        // 1. 리프레시 토큰 존재 및 유효성 검증
        RefreshToken refreshToken = refreshTokenRepository.findByTokenValue(refreshTokenValue)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다."));

        if (refreshToken.isExpired() || !jwtTokenProvider.validateToken(refreshTokenValue)) {
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException("만료된 리프레시 토큰입니다. 다시 로그인해주세요.");
        }

        // 2. 사용자 조회
        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 3. 새로운 토큰 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(user.getId());
        String newRefreshTokenValue = jwtTokenProvider.createRefreshToken(user.getId());

        // 4. 리프레시 토큰 갱신
        refreshToken.updateToken(newRefreshTokenValue, LocalDateTime.now().plusDays(14));

        return LoginResponse.of(newAccessToken, newRefreshTokenValue, user);
    }

    @Transactional
    protected void saveRefreshToken(Long userId, String tokenValue) {
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(14); // 리프레시 토큰 14일 유효

        refreshTokenRepository.findByUserId(userId)
                .ifPresentOrElse(
                        existingToken -> existingToken.updateToken(tokenValue, expiryDate),
                        () -> {
                            RefreshToken newToken = RefreshToken.builder()
                                    .userId(userId)
                                    .tokenValue(tokenValue)
                                    .expiryDate(expiryDate)
                                    .build();
                            refreshTokenRepository.save(newToken);
                        }
                );
    }
}
