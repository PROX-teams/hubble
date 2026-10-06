package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
public class GraphRankWorker {
    private final JdbcTemplate jdbc;

    @Transactional
    public int refreshBatch(int limit) {
        List<DirtyPair> rows = jdbc.query("""
                SELECT category, tag_a_id, tag_b_id FROM graph_rank_dirty_pairs
                ORDER BY requested_at, category, tag_a_id, tag_b_id
                LIMIT ? FOR UPDATE SKIP LOCKED
                """, (rs, row) -> new DirtyPair(Category.valueOf(rs.getString(1)), rs.getLong(2), rs.getLong(3)), limit);
        if (rows.isEmpty()) return 0;
        Map<Category, List<DirtyPair>> byCategory = rows.stream()
                .collect(Collectors.groupingBy(DirtyPair::category));
        byCategory.forEach(this::refreshCategory);
        return rows.size();
    }

    private void refreshCategory(Category category, List<DirtyPair> pairs) {
        StringJoiner pairSlots = new StringJoiner(", ");
        StringJoiner directedSlots = new StringJoiner(", ");
        List<Object> pairArgs = new ArrayList<>(pairs.size() * 2);
        List<Object> directedArgs = new ArrayList<>(pairs.size() * 4);
        for (DirtyPair pair : pairs) {
            pairSlots.add("(?, ?)");
            pairArgs.add(pair.a());
            pairArgs.add(pair.b());
            directedSlots.add("(?, ?)");
            directedArgs.add(pair.a());
            directedArgs.add(pair.b());
            directedSlots.add("(?, ?)");
            directedArgs.add(pair.b());
            directedArgs.add(pair.a());
        }

        List<Object> deleteArgs = new ArrayList<>();
        deleteArgs.add(category.name());
        deleteArgs.addAll(directedArgs);
        jdbc.update("DELETE FROM graph_ranked_neighbors WHERE category = ? "
                        + "AND (source_tag_id, target_tag_id) IN (" + directedSlots + ")",
                deleteArgs.toArray());

        List<Object> insertArgs = new ArrayList<>();
        insertArgs.add(category.name());
        insertArgs.addAll(pairArgs);
        jdbc.update("""
                INSERT INTO graph_ranked_neighbors(category, source_tag_id, target_tag_id,
                    target_name, target_usage_count, co_count, score)
                SELECT p.category,
                    IF(direction.side = 0, p.tag_a_id, p.tag_b_id),
                    IF(direction.side = 0, p.tag_b_id, p.tag_a_id),
                    t.name, target.note_count, p.co_count,
                    ROUND(CAST(p.co_count AS DECIMAL(38, 16)) /
                        (source.note_count + target.note_count - p.co_count), 16)
                FROM graph_tag_pair_stats p
                CROSS JOIN (SELECT 0 AS side UNION ALL SELECT 1 AS side) direction
                JOIN graph_tag_usage_stats source ON source.category = p.category
                    AND source.tag_id = IF(direction.side = 0, p.tag_a_id, p.tag_b_id)
                JOIN graph_tag_usage_stats target ON target.category = p.category
                    AND target.tag_id = IF(direction.side = 0, p.tag_b_id, p.tag_a_id)
                JOIN tags t ON t.id = target.tag_id
                WHERE p.category = ? AND (p.tag_a_id, p.tag_b_id) IN (%s)
                    AND p.co_count >= 2 AND source.note_count > 0 AND target.note_count > 0
                """.formatted(pairSlots), insertArgs.toArray());

        List<Object> doneArgs = new ArrayList<>();
        doneArgs.add(category.name());
        doneArgs.addAll(pairArgs);
        jdbc.update("DELETE FROM graph_rank_dirty_pairs WHERE category = ? "
                        + "AND (tag_a_id, tag_b_id) IN (" + pairSlots + ")",
                doneArgs.toArray());
    }

    record DirtyPair(Category category, long a, long b) {}
}
