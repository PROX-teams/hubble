package com.hubble.user.entity;

import com.hubble.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString
public class User extends BaseTimeEntity {

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern NICKNAME_REGEX = Pattern.compile("^.{1,15}$");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProviderType providerType;

    private LocalDateTime deletedAt;

    public User(String email, String password, String nickname, ProviderType providerType) {
        validate(email, password, nickname);
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.providerType = providerType;
    }

    private void validate(String email, String password, String nickname) {
        validateEmail(email);
        validatePassword(password);
        validateNickname(nickname);
    }

    private void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email이 null이거나 빈 값이어서는 안 됩니다.");
        }

        Matcher matcher = EMAIL_REGEX.matcher(email);
        if (!matcher.matches()) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("password가 null이거나 빈 값이어서는 안 됩니다.");
        }
    }

    private void validateNickname(String nickname) {
        if (nickname == null || nickname.isBlank()) {
            throw new IllegalArgumentException("nickname이 null이거나 빈 값이어서는 안 됩니다.");
        }

        Matcher matcher = NICKNAME_REGEX.matcher(nickname);
        if (!matcher.matches()) {
            throw new IllegalArgumentException("유효하지 않은 닉네임 형식입니다.");
        }
    }

    public boolean checkPassword(String loginPassword, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(loginPassword, this.password);
    }

    public void updatePassword(String newPassword) {
        validatePassword(newPassword);
        this.password = newPassword;
    }

    public void updateEmail(String newEmail) {
        validateEmail(newEmail);
        this.email = newEmail;
    }

    public void updateNickname(String newNickname) {
        validateNickname(newNickname);
        this.nickname = newNickname;
    }

    public boolean checkProviderType(ProviderType providerType) {
        return this.providerType == providerType;
    }
}
