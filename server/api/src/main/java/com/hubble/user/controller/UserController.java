package com.hubble.user.controller;

import com.hubble.user.dto.request.EmailConflictCheckRequest;
import com.hubble.user.dto.request.NicknameConflictCheckRequest;
import com.hubble.user.dto.request.UserCreateRequest;
import com.hubble.user.dto.response.EmailConflictCheckResponse;
import com.hubble.user.dto.response.NicknameConflictCheckResponse;
import com.hubble.user.dto.response.UserCreateResponse;
import com.hubble.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User API", description = "사용자 관리(회원가입, 정보 수정 등)를 위한 API")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "회원가입", description = "이메일, 비밀번호, 닉네임을 사용하여 새로운 사용자 계정을 생성합니다.")
    @PostMapping("/signup")
    public ResponseEntity<UserCreateResponse> signup(@Valid @RequestBody UserCreateRequest request) {
        UserCreateResponse response = userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "이메일 중복 확인", description = "가입하려는 이메일이 이미 존재하는지 확인합니다.")
    @PostMapping("/check-email")
    public ResponseEntity<EmailConflictCheckResponse> checkEmail(@Valid @RequestBody EmailConflictCheckRequest request) {
        boolean isConflict = userService.checkEmailConflict(request.email());
        return ResponseEntity.ok(new EmailConflictCheckResponse(isConflict));
    }

    @Operation(summary = "닉네임 중복 확인", description = "사용하려는 닉네임이 이미 존재하는지 확인합니다.")
    @PostMapping("/check-nickname")
    public ResponseEntity<NicknameConflictCheckResponse> checkNickname(@Valid @RequestBody NicknameConflictCheckRequest request) {
        boolean isConflict = userService.checkNicknameConflict(request.nickname());
        return ResponseEntity.ok(new NicknameConflictCheckResponse(isConflict));
    }

    @Operation(summary = "사용자 프로필 정보 조회", description = "특정 사용자의 기본 프로필(ID, 이메일, 닉네임)을 조회합니다.")
    @org.springframework.web.bind.annotation.GetMapping("/{userId}")
    public ResponseEntity<com.hubble.user.dto.response.UserProfileResponse> getUserProfile(
            @org.springframework.web.bind.annotation.PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }
}
