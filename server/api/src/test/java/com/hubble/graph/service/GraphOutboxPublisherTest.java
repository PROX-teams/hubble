package com.hubble.graph.service;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GraphOutboxPublisherTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    @SuppressWarnings("unchecked")
    private final KafkaTemplate<String, String> kafka = mock(KafkaTemplate.class);
    private final GraphOutboxClaims claims = mock(GraphOutboxClaims.class);
    private final GraphOutboxPublisher publisher = new GraphOutboxPublisher(jdbc, kafka, claims);

    @Test
    void marksOnlyAcknowledgedMessageAsPublished() {
        when(claims.claim(anyString(), eq(100)))
                .thenReturn(List.of(new GraphOutboxPublisher.OutboxRow("event-1", 42L, "{}")));
        when(kafka.send("graph-note-changes", "42", "{}"))
                .thenReturn(CompletableFuture.completedFuture(null));

        publisher.publishPending();

        verify(jdbc).update(contains("SET published_at"), eq("event-1"), anyString());
    }
}
