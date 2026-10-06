package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;

class GraphEventProcessorTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final GraphStatsStore stats = mock(GraphStatsStore.class);
    private final GraphEventProcessor processor = new GraphEventProcessor(jdbc, stats);

    @Test
    void duplicateEventCannotApplyCountersAgain() {
        GraphNoteChange event = new GraphNoteChange("event-1", 1L, null, List.of(),
                Category.DEVELOPMENT, List.of(2L, 3L));
        when(jdbc.update(contains("graph_processed_events"), eq("event-1"))).thenReturn(0);

        processor.process(event);

        verify(stats, never()).apply(any(), any(), org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void firstDeliveryAppliesTheExactTransition() {
        GraphNoteChange event = new GraphNoteChange("event-2", 1L,
                Category.DEVELOPMENT, List.of(2L, 3L),
                Category.DESIGN, List.of(2L, 4L));
        when(jdbc.update(contains("graph_processed_events"), eq("event-2"))).thenReturn(1);

        processor.process(event);

        verify(stats).replace(Category.DEVELOPMENT, List.of(2L, 3L),
                Category.DESIGN, List.of(2L, 4L));
        verify(jdbc, times(2)).update(contains("graph_rank_dirty_pairs"), any(Object[].class));
    }

    @Test
    void unchangedTagUsageDoesNotDirtyAllOfItsOtherPairs() {
        GraphNoteChange event = new GraphNoteChange("event-3", 1L,
                Category.DEVELOPMENT, List.of(1L, 2L),
                Category.DEVELOPMENT, List.of(1L, 3L));
        when(jdbc.update(contains("graph_processed_events"), eq("event-3"))).thenReturn(1);

        processor.process(event);

        ArgumentCaptor<Object[]> args = ArgumentCaptor.forClass(Object[].class);
        verify(jdbc).update(contains("graph_rank_dirty_pairs"), args.capture());
        assertThat(args.getValue()).contains(2L, 3L).doesNotContain(1L);
    }
}
