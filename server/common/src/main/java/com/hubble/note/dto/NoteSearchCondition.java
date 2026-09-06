package com.hubble.note.dto;

import com.hubble.common.entity.Category;

public record NoteSearchCondition(
        Long userId,
        Long storyId,
        Category category,
        String tagName,
        String keyword
) {
    public static NoteSearchCondition of(Long userId, Long storyId, Category category, String tagName, String keyword) {
        return new NoteSearchCondition(userId, storyId, category, tagName, keyword);
    }

    public static NoteSearchCondition forFeed(Category category, String keyword, String tagName) {
        return new NoteSearchCondition(null, null, category, tagName, keyword);
    }

    public static NoteSearchCondition forUser(Long userId, String tagName) {
        return new NoteSearchCondition(userId, null, null, tagName, null);
    }
}
