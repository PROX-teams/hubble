package com.hubble.auth.controller;

import com.hubble.auth.dto.request.EmailSendRequest;
import com.hubble.auth.dto.request.EmailVerifyRequest;
import com.hubble.auth.dto.request.LoginRequest;
import com.hubble.auth.dto.response.LoginResponse;
import com.hubble.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "인증 관련 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "이메일 인증 코드 발송", description = "회원가입 시 사용할 인증 코드를 이메일로 전송합니다.")
    @PostMapping("/email/send")
    public ResponseEntity<Void> sendEmail(@Valid @RequestBody EmailSendRequest request) {
        authService.sendVerificationEmail(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "이메일 인증 코드 검증", description = "전송된 인증 코드가 일효한지 확인합니다.")
    @PostMapping("/email/verify")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody EmailVerifyRequest request) {
        authService.verifyEmail(request.getEmail(), request.getCode());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "이메일 로그인", description = "이메일과 비밀번호로 로그인을 수행하고 토큰을 발급합니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 통해 새로운 액세스 토큰을 발급받습니다.")
    @PostMapping("/reissue")
    public ResponseEntity<LoginResponse> reissue(@RequestBody String refreshToken) {
        LoginResponse response = authService.reissue(refreshToken);
        return ResponseEntity.ok(response);
    }
}
