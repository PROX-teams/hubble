package com.hubble.graph.service;

import com.hubble.common.entity.Category;

import java.util.List;

/** An immutable note-tag transition. The event ID makes delivery retries harmless. */
public record GraphNoteChange(
        String eventId,
        long noteId,
        Category oldCategory,
        List<Long> oldTagIds,
        Category newCategory,
        List<Long> newTagIds
) {
}
