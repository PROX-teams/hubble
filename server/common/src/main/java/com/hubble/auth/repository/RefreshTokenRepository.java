package com.hubble.auth.repository;

import com.hubble.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenValue(String tokenValue);
    Optional<RefreshToken> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
