package com.hubble.user.dto;

/**
 * 인기 크리에이터 집계 결과 매핑용 DTO
 */
public record TrendingCreatorDto(
        Long userId,
        String nickname,
        long noteCount,
        long totalLikes,
        long totalBookmarks
) {}
