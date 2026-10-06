package com.hubble.graph.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

class GraphChangeRecorderTest {
    private final GraphStatsStore stats = mock(GraphStatsStore.class);
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final GraphChangeRecorder recorder = new GraphChangeRecorder(stats, jdbc, new ObjectMapper());

    @Test
    void defaultModeKeepsCurrentSynchronousWrite() {
        recorder.record(1L, null, List.of(), Category.DEVELOPMENT, List.of(2L, 3L));

        verify(stats).apply(Category.DEVELOPMENT, List.of(2L, 3L), 1);
        verify(jdbc, never()).update(anyString(), org.mockito.ArgumentMatchers.any(Object[].class));
    }

    @Test
    void asyncModeRecordsOutboxWithoutUpdatingCounters() {
        ReflectionTestUtils.setField(recorder, "asyncEnabled", true);
        recorder.record(1L, null, List.of(), Category.DEVELOPMENT, List.of(2L, 3L));

        verify(jdbc).update(org.mockito.ArgumentMatchers.contains("graph_note_outbox"),
                anyString(), eq(1L), anyString());
        verify(stats, never()).apply(Category.DEVELOPMENT, List.of(2L, 3L), 1);
    }
}
