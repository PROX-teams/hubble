package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.TagCountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.StringJoiner;

@Repository
@RequiredArgsConstructor
public class GraphStatsStore {
    private static final int WRITE_CHUNK_SIZE = 500;
    private final JdbcTemplate jdbc;

    public record Center(long tagId, long usageCount) {}
    public record Neighbor(long tagId, String name, long coCount, long usageCount) {}
    public record RankedNeighbor(String name, long coCount, long usageCount, double score) {}
    public record Cursor(long coCount, long tagId) {}
    public enum Side { TAG_A, TAG_B }

    public List<TagCountDto> topTags(Category category, int limit) {
        return jdbc.query("""
                SELECT t.name, u.note_count
                FROM graph_tag_usage_stats u JOIN tags t ON t.id = u.tag_id
                WHERE u.category = ? AND u.note_count > 0
                ORDER BY u.note_count DESC, t.name ASC
                LIMIT ?
                """, (rs, row) -> new TagCountDto(rs.getString(1), rs.getLong(2)),
                category.name(), limit);
    }

    public Optional<Center> center(Category category, String name) {
        return jdbc.query("""
                SELECT t.id, u.note_count FROM tags t
                JOIN graph_tag_usage_stats u ON u.tag_id = t.id AND u.category = ?
                WHERE t.name = ? AND u.note_count > 0
                """, (rs, row) -> new Center(rs.getLong(1), rs.getLong(2)),
                category.name(), name).stream().findFirst();
    }

    public List<Neighbor> neighborPage(Category category, long centerId, Side side,
                                        Cursor cursor, long minCoCount, int limit) {
        String centerColumn = side == Side.TAG_A ? "tag_a_id" : "tag_b_id";
        String neighborColumn = side == Side.TAG_A ? "tag_b_id" : "tag_a_id";
        String after = cursor == null ? "" : """
                AND (p.co_count < ? OR (p.co_count = ? AND p.%s > ?))
                """.formatted(neighborColumn);
        String sql = """
                SELECT t.id, t.name, p.co_count, u.note_count
                FROM graph_tag_pair_stats p
                JOIN graph_tag_usage_stats u ON u.category = p.category AND u.tag_id = p.%s
                JOIN tags t ON t.id = p.%s
                WHERE p.category = ? AND p.%s = ? AND p.co_count >= ?
                %s
                ORDER BY p.co_count DESC, p.%s ASC
                LIMIT ?
                """.formatted(neighborColumn, neighborColumn, centerColumn, after, neighborColumn);
        List<Object> args = new ArrayList<>(List.of(category.name(), centerId, minCoCount));
        if (cursor != null) {
            args.add(cursor.coCount());
            args.add(cursor.coCount());
            args.add(cursor.tagId());
        }
        args.add(limit);
        return jdbc.query(sql, (rs, row) -> new Neighbor(
                rs.getLong(1), rs.getString(2), rs.getLong(3), rs.getLong(4)), args.toArray());
    }

    public List<RankedNeighbor> rankedNeighbors(Category category, String sourceName,
                                                  Set<String> excluded, int limit) {
        List<String> excludedNames = List.copyOf(excluded);
        StringJoiner excludedPlaceholders = new StringJoiner(", ");
        excludedNames.forEach(name -> excludedPlaceholders.add("?"));
        String exclusionClause = excludedNames.isEmpty() ? "" :
                "AND r.target_name NOT IN (" + excludedPlaceholders + ")";
        String sql = """
                SELECT r.target_name, r.co_count, r.target_usage_count, r.score
                FROM graph_ranked_neighbors r
                WHERE r.category = ?
                    AND r.source_tag_id = (SELECT id FROM tags WHERE name = ?)
                    %s
                ORDER BY r.score DESC, r.co_count DESC, r.target_name ASC
                LIMIT ?
                """.formatted(exclusionClause);
        List<Object> args = new ArrayList<>();
        args.add(category.name());
        args.add(sourceName);
        args.addAll(excludedNames);
        args.add(limit);
        return jdbc.query(sql, (rs, row) -> new RankedNeighbor(
                rs.getString(1), rs.getLong(2), rs.getLong(3), rs.getDouble(4)), args.toArray());
    }

    public void apply(Category category, List<Long> tagIds, int delta) {
        if (delta != 1 && delta != -1) throw new IllegalArgumentException("delta must be +1 or -1");
        if (delta == 1) replace(category, List.of(), category, tagIds);
        else replace(category, tagIds, category, List.of());
    }

    public void replace(Category oldCategory, List<Long> oldIds, Category newCategory, List<Long> newIds) {
        Set<Long> oldSet = new HashSet<>(oldIds);
        Set<Long> newSet = new HashSet<>(newIds);
        List<UsageDelta> usage = new ArrayList<>();
        List<PairDelta> pairs = new ArrayList<>();
        if (oldCategory != newCategory) {
            oldSet.forEach(id -> usage.add(new UsageDelta(oldCategory, id, -1)));
            newSet.forEach(id -> usage.add(new UsageDelta(newCategory, id, 1)));
            pairs(oldSet).forEach(pair -> pairs.add(new PairDelta(oldCategory, pair.a(), pair.b(), -1)));
            pairs(newSet).forEach(pair -> pairs.add(new PairDelta(newCategory, pair.a(), pair.b(), 1)));
        } else {
            oldSet.stream().filter(id -> !newSet.contains(id))
                    .forEach(id -> usage.add(new UsageDelta(oldCategory, id, -1)));
            newSet.stream().filter(id -> !oldSet.contains(id))
                    .forEach(id -> usage.add(new UsageDelta(newCategory, id, 1)));
            Set<Pair> oldPairs = pairs(oldSet);
            Set<Pair> newPairs = pairs(newSet);
            oldPairs.stream().filter(pair -> !newPairs.contains(pair))
                    .forEach(pair -> pairs.add(new PairDelta(oldCategory, pair.a(), pair.b(), -1)));
            newPairs.stream().filter(pair -> !oldPairs.contains(pair))
                    .forEach(pair -> pairs.add(new PairDelta(newCategory, pair.a(), pair.b(), 1)));
        }
        usage.sort(Comparator.comparing(UsageDelta::category).thenComparingLong(UsageDelta::tagId));
        pairs.sort(Comparator.comparing(PairDelta::category)
                .thenComparingLong(PairDelta::a).thenComparingLong(PairDelta::b));
        upsertUsage(usage);
        upsertPairs(pairs);
    }

    private Set<Pair> pairs(Set<Long> ids) {
        List<Long> sorted = ids.stream().sorted().toList();
        Set<Pair> result = new HashSet<>();
        for (int i = 0; i < sorted.size(); i++) {
            for (int j = i + 1; j < sorted.size(); j++) {
                result.add(new Pair(sorted.get(i), sorted.get(j)));
            }
        }
        return result;
    }

    private void upsertUsage(List<UsageDelta> rows) {
        for (int start = 0; start < rows.size(); start += WRITE_CHUNK_SIZE) {
            List<UsageDelta> chunk = rows.subList(start, Math.min(start + WRITE_CHUNK_SIZE, rows.size()));
            StringJoiner values = new StringJoiner(", ");
            List<Object> args = new ArrayList<>(chunk.size() * 3);
            for (UsageDelta row : chunk) {
                values.add("(?, ?, ?)");
                args.add(row.category().name());
                args.add(row.tagId());
                args.add(row.delta());
            }
            jdbc.update("INSERT INTO graph_tag_usage_stats(category, tag_id, note_count) VALUES " + values
                    + " ON DUPLICATE KEY UPDATE note_count = note_count + VALUES(note_count)", args.toArray());
        }
    }

    private void upsertPairs(List<PairDelta> rows) {
        for (int start = 0; start < rows.size(); start += WRITE_CHUNK_SIZE) {
            List<PairDelta> chunk = rows.subList(start, Math.min(start + WRITE_CHUNK_SIZE, rows.size()));
            StringJoiner values = new StringJoiner(", ");
            List<Object> args = new ArrayList<>(chunk.size() * 4);
            for (PairDelta row : chunk) {
                values.add("(?, ?, ?, ?)");
                args.add(row.category().name());
                args.add(row.a());
                args.add(row.b());
                args.add(row.delta());
            }
            jdbc.update("INSERT INTO graph_tag_pair_stats(category, tag_a_id, tag_b_id, co_count) VALUES " + values
                    + " ON DUPLICATE KEY UPDATE co_count = co_count + VALUES(co_count)", args.toArray());
        }
    }

    private record Pair(long a, long b) {}
    private record UsageDelta(Category category, long tagId, int delta) {}
    private record PairDelta(Category category, long a, long b, int delta) {}
}
