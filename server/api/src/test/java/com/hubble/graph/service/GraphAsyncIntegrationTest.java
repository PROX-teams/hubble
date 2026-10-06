package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.service.NoteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

/** Run only against a disposable MySQL database and Kafka broker. */
@EnabledIfEnvironmentVariable(named = "GRAPH_INTEGRATION_ENABLED", matches = "true")
@SpringBootTest(properties = {"graph.async.enabled=true", "graph.worker.enabled=true"})
class GraphAsyncIntegrationTest {
    @Autowired NoteService notes;
    @Autowired JdbcTemplate jdbc;

    @Test
    void createUpdateDeleteFlowsThroughOutboxKafkaAndRankWorker() throws Exception {
        Long userId = jdbc.queryForObject("SELECT id FROM users ORDER BY id LIMIT 1", Long.class);
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String a = "graph-it-a-" + suffix;
        String b = "graph-it-b-" + suffix;
        Long first = null;
        Long second = null;
        try {
            first = notes.createNote(userId, request(List.of(a, b))).id();
            second = notes.createNote(userId, request(List.of(a, b))).id();
            await(() -> usage(a) == 2 && usage(b) == 2 && pair(a, b) == 2 && rank(a, b) == 1);

            assertEquals(List.of(a), notes.updateNote(userId, first, request(List.of(a))).tag());
            await(() -> usage(a) == 2 && usage(b) == 1 && pair(a, b) == 1 && rank(a, b) == 0);

            assertEquals(Category.DESIGN,
                    notes.updateNote(userId, first, request(Category.DESIGN, List.of(a))).category());
            await(() -> usage(a) == 1 && usageIn(Category.DESIGN, a) == 1
                    && usage(b) == 1 && pair(a, b) == 1);

            notes.deleteNote(userId, second);
            second = null;
            await(() -> usage(a) == 0 && usageIn(Category.DESIGN, a) == 1
                    && usage(b) == 0 && pair(a, b) == 0);
        } finally {
            if (first != null) notes.deleteNote(userId, first);
            if (second != null) notes.deleteNote(userId, second);
        }
        await(() -> usage(a) == 0 && usageIn(Category.DESIGN, a) == 0
                && usage(b) == 0 && pair(a, b) == 0);
        assertEquals(0, rank(a, b));
    }

    private NoteCreateRequest request(List<String> tags) {
        return request(Category.DEVELOPMENT, tags);
    }

    private NoteCreateRequest request(Category category, List<String> tags) {
        return new NoteCreateRequest("Graph integration note", "Disposable integration data",
                category, null, tags, null);
    }

    private long usage(String name) {
        return usageIn(Category.DEVELOPMENT, name);
    }

    private long usageIn(Category category, String name) {
        Long count = jdbc.queryForObject("""
                SELECT COALESCE(MAX(u.note_count), 0) FROM graph_tag_usage_stats u
                JOIN tags t ON t.id = u.tag_id
                WHERE u.category = ? AND t.name = ?
                """, Long.class, category.name(), name);
        return count == null ? 0 : count;
    }

    private long pair(String a, String b) {
        Long count = jdbc.queryForObject("""
                SELECT COALESCE(MAX(p.co_count), 0) FROM graph_tag_pair_stats p
                JOIN tags a ON a.id = p.tag_a_id JOIN tags b ON b.id = p.tag_b_id
                WHERE p.category = 'DEVELOPMENT' AND
                    ((a.name = ? AND b.name = ?) OR (a.name = ? AND b.name = ?))
                """, Long.class, a, b, b, a);
        return count == null ? 0 : count;
    }

    private long rank(String a, String b) {
        Long count = jdbc.queryForObject("""
                SELECT COUNT(*) FROM graph_ranked_neighbors r
                JOIN tags source ON source.id = r.source_tag_id
                JOIN tags target ON target.id = r.target_tag_id
                WHERE r.category = 'DEVELOPMENT' AND source.name = ? AND target.name = ?
                """, Long.class, a, b);
        return count == null ? 0 : count;
    }

    private void await(Check check) throws Exception {
        Instant deadline = Instant.now().plus(Duration.ofSeconds(30));
        while (Instant.now().isBefore(deadline)) {
            if (check.ready()) return;
            Thread.sleep(200);
        }
        fail("Graph pipeline did not converge within 30 seconds");
    }

    private interface Check { boolean ready(); }
}
