package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

class GraphRankWorkerTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final GraphRankWorker worker = new GraphRankWorker(jdbc);

    @Test
    void refreshesBothDirectionsAndAcknowledgesClaimedPair() {
        doReturn(List.of(new GraphRankWorker.DirtyPair(Category.DESIGN, 101L, 102L)))
                .when(jdbc).query(anyString(), any(RowMapper.class), eq(200));

        assertThat(worker.refreshBatch(200)).isEqualTo(1);

        verify(jdbc).update(contains("DELETE FROM graph_ranked_neighbors"), any(Object[].class));
        verify(jdbc).update(contains("INSERT INTO graph_ranked_neighbors"), any(Object[].class));
        verify(jdbc).update(contains("DELETE FROM graph_rank_dirty_pairs"), any(Object[].class));
    }

    @Test
    void emptyQueueDoesNotWrite() {
        doReturn(List.of()).when(jdbc).query(anyString(), any(RowMapper.class), eq(200));

        assertThat(worker.refreshBatch(200)).isZero();

        verify(jdbc).query(anyString(), any(RowMapper.class), eq(200));
        verifyNoMoreInteractions(jdbc);
    }
}
