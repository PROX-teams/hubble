package com.hubble.story.dto.response;

import com.hubble.common.entity.Category;
import com.hubble.note.entity.Note;
import com.hubble.story.entity.Story;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Schema(description = "스토리 응답 (프론트엔드 인터페이스 매칭)")
public record StoryResponse(
        @Schema(description = "스토리 ID", example = "1")
        Long id,

        @Schema(description = "스토리 제목", example = "나의 전공 지식 정리")
        String title,

        @Schema(description = "스토리 설명", example = "내가 배운 지식들을 정리한 폴더")
        String description,

        @Schema(description = "카테고리", example = "DEVELOPMENT")
        Category category,

        @Schema(description = "스토리 아이콘", example = "folder-icon")
        String icon,

        @Schema(description = "속한 노트 ID 목록 (articleIds)", example = "[1, 2, 3]")
        List<Long> articleIds,

        @Schema(description = "작성자 닉네임 (author)", example = "hubble-user")
        String author,

        @Schema(description = "생성 일시 (date)", example = "2024-03-11T00:00:00")
        LocalDateTime date,

        @Schema(description = "좋아요 수 (likeCount)", example = "10")
        long likeCount,

        @Schema(description = "조회수", example = "100")
        long viewCount,

        @Schema(description = "북마크 수", example = "5")
        long bookmarkCount,

        @Schema(description = "좋아요 여부", example = "true")
        boolean isLiked,

        @Schema(description = "북마크 여부", example = "false")
        boolean isBookmarked
) {
    public static StoryResponse of(Story story, boolean isLiked, boolean isBookmarked) {
        return new StoryResponse(
                story.getId(),
                story.getTitle(),
                story.getDescription(),
                story.getCategory(),
                story.getIcon(),
                story.getNotes().stream()
                        .map(Note::getId)
                        .collect(Collectors.toList()),
                story.getUser().getNickname(),
                story.getCreatedAt(),
                story.getLikeCount(),
                story.getViewCount(),
                story.getBookmarkCount(),
                isLiked,
                isBookmarked
        );
    }
}
