package com.hubble.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 10)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Builder.Default
    @Column(nullable = false)
    private boolean isVerified = false;

    /**
     * 인증 여부 확인 로직
     * 만료되지 않았으며, 코드가 일치하는 경우
     */
    public boolean verify(String inputCode) {
        if (isExpired()) {
            throw new IllegalStateException("인증 코드가 만료되었습니다.");
        }
        if (this.code.equals(inputCode)) {
            this.isVerified = true;
            return true;
        }
        return false;
    }

    /**
     * 코드 만료 여부 확인
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
