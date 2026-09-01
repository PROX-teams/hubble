package com.hubble.note.dto;

import java.time.LocalDateTime;

/**
 * 최근 업데이트 노트 조회 전용 경량 프로젝션 DTO (성능 최적화용)
 */
public record NoteHistoryDto(
        Long id,
        String title,
        String storyTitle,
        LocalDateTime date
) {
}
