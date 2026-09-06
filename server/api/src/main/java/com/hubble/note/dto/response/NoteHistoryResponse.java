package com.hubble.note.dto.response;

import com.hubble.note.dto.NoteHistoryDto;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "노트 업데이트 이력 응답")
public record NoteHistoryResponse(
        @Schema(description = "노트 ID", example = "1")
        Long id,

        @Schema(description = "노트 제목", example = "React 19 정리")
        String title,

        @Schema(description = "소속 스토리 제목 (없으면 null)", example = "프론트엔드 공부집")
        String storyTitle,

        @Schema(description = "수정 일시", example = "2026-09-01T15:30:00")
        LocalDateTime date
) {
    public static NoteHistoryResponse from(NoteHistoryDto dto) {
        return new NoteHistoryResponse(
                dto.id(),
                dto.title(),
                dto.storyTitle(),
                dto.date()
        );
    }
}
