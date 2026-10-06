package com.hubble.graph.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
public class GraphOutboxPublisher {
    private final JdbcTemplate jdbc;
    private final KafkaTemplate<String, String> kafka;
    private final GraphOutboxClaims claims;

    @Scheduled(fixedDelayString = "${graph.outbox.poll-ms:500}")
    public void publishPending() {
        String owner = UUID.randomUUID().toString();
        List<PendingSend> sent = new ArrayList<>();
        for (OutboxRow row : claims.claim(owner, 100)) {
            try {
                sent.add(new PendingSend(row, kafka.send("graph-note-changes",
                        Long.toString(row.noteId()), row.payload())));
            } catch (Exception e) {
                log.error("Graph outbox publish failed: eventId={}", row.id(), e);
            }
        }
        try {
            CompletableFuture.allOf(sent.stream().map(PendingSend::future).toArray(CompletableFuture[]::new))
                    .get(20, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("Graph outbox batch did not fully publish", e);
        }
        for (PendingSend item : sent) {
            if (!item.future().isDone() || item.future().isCompletedExceptionally()) continue;
            try {
                // An acknowledged send may be retried if marking it published fails.
                // The consumer's processed-event key makes that safe.
                jdbc.update("UPDATE graph_note_outbox SET published_at = NOW(6), lease_owner = NULL, lease_until = NULL "
                        + "WHERE id = ? AND lease_owner = ? AND published_at IS NULL", item.row().id(), owner);
            } catch (Exception e) {
                log.error("Cannot mark published graph event: eventId={}", item.row().id(), e);
            }
        }
    }

    record OutboxRow(String id, long noteId, String payload) {}
    record PendingSend(OutboxRow row, CompletableFuture<SendResult<String, String>> future) {}
}

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
class GraphOutboxClaims {
    private final JdbcTemplate jdbc;

    @Transactional
    public List<GraphOutboxPublisher.OutboxRow> claim(String owner, int limit) {
        List<GraphOutboxPublisher.OutboxRow> rows = jdbc.query("""
                SELECT o.id, o.note_id, o.payload FROM graph_note_outbox o
                WHERE o.published_at IS NULL AND (o.lease_until IS NULL OR o.lease_until < NOW(6))
                  AND NOT EXISTS (
                    SELECT 1 FROM graph_note_outbox earlier
                    WHERE earlier.note_id = o.note_id AND earlier.seq < o.seq
                      AND earlier.published_at IS NULL
                  )
                ORDER BY o.seq LIMIT ? FOR UPDATE SKIP LOCKED
                """, (rs, row) -> new GraphOutboxPublisher.OutboxRow(
                rs.getString(1), rs.getLong(2), rs.getString(3)), limit);
        for (GraphOutboxPublisher.OutboxRow row : rows) {
            jdbc.update("UPDATE graph_note_outbox SET lease_owner = ?, lease_until = DATE_ADD(NOW(6), INTERVAL 60 SECOND) "
                    + "WHERE id = ?", owner, row.id());
        }
        return rows;
    }
}
