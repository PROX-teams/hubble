package com.hubble.graph.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GraphChangeRecorder {
    private final GraphStatsStore stats;
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    @Value("${graph.async.enabled:false}")
    private boolean asyncEnabled;

    /** Called inside the note transaction. The outbox insert rolls back with the note. */
    public void record(Long noteId, Category oldCategory, List<Long> oldTagIds,
                       Category newCategory, List<Long> newTagIds) {
        if (!asyncEnabled) {
            if (oldCategory == null) stats.apply(newCategory, newTagIds, 1);
            else if (newCategory == null) stats.apply(oldCategory, oldTagIds, -1);
            else stats.replace(oldCategory, oldTagIds, newCategory, newTagIds);
            return;
        }
        if (noteId == null) throw new IllegalStateException("Persisted note must have an ID");
        GraphNoteChange event = new GraphNoteChange(UUID.randomUUID().toString(), noteId,
                oldCategory, List.copyOf(oldTagIds), newCategory, List.copyOf(newTagIds));
        try {
            jdbc.update("INSERT INTO graph_note_outbox(id, note_id, payload, created_at) VALUES (?, ?, ?, NOW(6))",
                    event.eventId(), noteId, objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Cannot serialize graph change", e);
        }
    }
}
