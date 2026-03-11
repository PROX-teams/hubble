package com.hubble.note.dto.response;

import com.hubble.common.entity.Category;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteTag;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Schema(description = "노트 응답 (프론트엔드 인터페이스 매칭)")
public record NoteResponse(
        @Schema(description = "노트 ID", example = "1")
        Long id,

        @Schema(description = "노트 제목", example = "나의 첫 번째 노트")
        String title,

        @Schema(description = "노트 상세 설명(내용)", example = "이것은 상세 내용입니다.")
        String description,

        @Schema(description = "카테고리", example = "DEVELOPMENT")
        Category category,

        @Schema(description = "대표 이미지 URL", example = "https://example.com/image.png")
        String imageUrl,

        @Schema(description = "태그 리스트", example = "[\"Java\", \"Spring\"]")
        List<String> tag,

        @Schema(description = "작성자 닉네임 (author)", example = "hubble-user")
        String author,

        @Schema(description = "생성 일시 (date)", example = "2024-03-11T00:00:00")
        LocalDateTime date,

        @Schema(description = "좋아요 수 (likeCount)", example = "10")
        long likeCount,

        @Schema(description = "스토리 ID", example = "1")
        Long storyId,

        @Schema(description = "조회수", example = "100")
        long viewCount,

        @Schema(description = "북마크 수", example = "5")
        long bookmarkCount,

        @Schema(description = "좋아요 여부", example = "true")
        boolean isLiked,

        @Schema(description = "북마크 여부", example = "false")
        boolean isBookmarked
) {
    public static NoteResponse of(Note note, boolean isLiked, boolean isBookmarked) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCategory(),
                note.getImageUrl(),
                note.getNoteTags().stream()
                        .map(noteTag -> noteTag.getTag().getName())
                        .collect(Collectors.toList()),
                note.getUser().getNickname(),
                note.getCreatedAt(),
                note.getLikeCount(),
                note.getStory() != null ? note.getStory().getId() : null,
                note.getViewCount(),
                note.getBookmarkCount(),
                isLiked,
                isBookmarked
        );
    }
}
