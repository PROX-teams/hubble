package com.hubble.user.service;

import com.hubble.auth.entity.EmailVerification;
import com.hubble.auth.repository.EmailVerificationRepository;
import com.hubble.user.dto.request.UserCreateRequest;
import com.hubble.user.dto.response.UserCreateResponse;
import com.hubble.user.entity.ProviderType;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationRepository emailVerificationRepository;

    /**
     * 이메일 중복 확인 (ProviderType.EMAIL 기준)
     */
    public boolean checkEmailConflict(String email) {
        return userRepository.existsByEmailAndProviderType(email, ProviderType.EMAIL);
    }

    /**
     * 닉네임 중복 확인
     */
    public boolean checkNicknameConflict(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    /**
     * 사용자 프로필 정보 조회
     */
    public com.hubble.user.dto.response.UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        return com.hubble.user.dto.response.UserProfileResponse.from(user);
    }

    /**
     * 회원가입 (Signup)
     */
    @Transactional
    public UserCreateResponse signup(UserCreateRequest request) {
        // 1. 비밀번호 일치 확인 (password vs rePassword)
        if (!request.password().equals(request.rePassword())) {
            throw new IllegalArgumentException("비밀번호가 서로 일치하지 않습니다.");
        }

        // 2. 이메일 인증 여부 확인
        EmailVerification verification = emailVerificationRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 인증이 필요합니다."));
        
        if (!verification.isVerified()) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }

        // 3. 이메일 중복 체크
        if (checkEmailConflict(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 4. 닉네임 중복 체크
        if (checkNicknameConflict(request.nickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 5. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.password());

        // 6. User 엔티티 생성 및 저장 (기본적으로 ProviderType.EMAIL)
        User user = new User(
                request.email(),
                encodedPassword,
                request.nickname(),
                ProviderType.EMAIL
        );

        User savedUser = userRepository.save(user);

        // 7. 가입 완료 후 인증 정보 삭제 (Cleanup)
        emailVerificationRepository.delete(verification);

        // 8. 엔티티를 DTO로 변환하여 반환
        return UserCreateResponse.from(savedUser);
    }
}
