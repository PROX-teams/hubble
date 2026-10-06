package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
public class GraphEventProcessor {
    private final JdbcTemplate jdbc;
    private final GraphStatsStore stats;

    @Transactional
    public void process(GraphNoteChange event) {
        int inserted = jdbc.update("INSERT IGNORE INTO graph_processed_events(event_id, processed_at) VALUES (?, NOW(6))",
                event.eventId());
        if (inserted == 0) return;

        Category oldCategory = event.oldCategory();
        Category newCategory = event.newCategory();
        if (oldCategory == null && newCategory == null) throw new IllegalArgumentException("Empty graph change");
        if (oldCategory == null) stats.apply(newCategory, event.newTagIds(), 1);
        else if (newCategory == null) stats.apply(oldCategory, event.oldTagIds(), -1);
        else stats.replace(oldCategory, event.oldTagIds(), newCategory, event.newTagIds());

        if (oldCategory != newCategory) {
            if (oldCategory != null) markAffected(oldCategory, new HashSet<>(event.oldTagIds()));
            if (newCategory != null) markAffected(newCategory, new HashSet<>(event.newTagIds()));
        } else {
            Set<Long> changed = new HashSet<>(event.oldTagIds());
            for (Long id : event.newTagIds()) {
                if (!changed.add(id)) changed.remove(id);
            }
            markAffected(oldCategory, changed);
        }
    }

    /** Only pairs incident to tags whose usage changed need a score refresh. */
    private void markAffected(Category category, Set<Long> tagIds) {
        if (tagIds.isEmpty()) return;
        StringJoiner placeholders = new StringJoiner(", ");
        tagIds.forEach(id -> placeholders.add("?"));
        String in = placeholders.toString();
        Object[] args = new Object[tagIds.size() * 2 + 2];
        int i = 0;
        args[i++] = category.name();
        args[i++] = category.name();
        for (long id : tagIds) args[i++] = id;
        for (long id : tagIds) args[i++] = id;
        jdbc.update("""
                INSERT INTO graph_rank_dirty_pairs(category, tag_a_id, tag_b_id, requested_at)
                SELECT ?, p.tag_a_id, p.tag_b_id, NOW(6)
                FROM graph_tag_pair_stats p
                WHERE p.category = ? AND (p.tag_a_id IN (%s) OR p.tag_b_id IN (%s))
                ON DUPLICATE KEY UPDATE requested_at = NOW(6)
                """.formatted(in, in), args);
    }
}
