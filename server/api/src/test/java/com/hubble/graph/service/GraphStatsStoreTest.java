package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.stream.LongStream;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class GraphStatsStoreTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final GraphStatsStore store = new GraphStatsStore(jdbc);

    @Test
    void eightTagsCreateTwentyEightUnorderedPairsInTwoStatements() {
        store.apply(Category.DEVELOPMENT, List.of(8L, 7L, 6L, 5L, 4L, 3L, 2L, 1L), 1);

        ArgumentCaptor<Object[]> usageArgs = ArgumentCaptor.forClass(Object[].class);
        ArgumentCaptor<Object[]> pairArgs = ArgumentCaptor.forClass(Object[].class);
        verify(jdbc).update(contains("graph_tag_usage_stats"), usageArgs.capture());
        verify(jdbc).update(contains("graph_tag_pair_stats"), pairArgs.capture());
        org.assertj.core.api.Assertions.assertThat(usageArgs.getValue()).hasSize(8 * 3);
        org.assertj.core.api.Assertions.assertThat(pairArgs.getValue()).hasSize(28 * 4);
    }

    @Test
    void replaceOnlyChangesRemovedAndAddedRelationships() {
        store.replace(Category.DEVELOPMENT, List.of(1L, 2L),
                Category.DEVELOPMENT, List.of(1L, 3L));

        ArgumentCaptor<Object[]> usageArgs = ArgumentCaptor.forClass(Object[].class);
        ArgumentCaptor<Object[]> pairArgs = ArgumentCaptor.forClass(Object[].class);
        verify(jdbc).update(contains("graph_tag_usage_stats"), usageArgs.capture());
        verify(jdbc).update(contains("graph_tag_pair_stats"), pairArgs.capture());
        org.assertj.core.api.Assertions.assertThat(usageArgs.getValue())
                .containsExactly("DEVELOPMENT", 2L, -1, "DEVELOPMENT", 3L, 1);
        org.assertj.core.api.Assertions.assertThat(pairArgs.getValue())
                .containsExactly("DEVELOPMENT", 1L, 2L, -1, "DEVELOPMENT", 1L, 3L, 1);
    }

    @Test
    void unchangedTagsDoNotWriteStatistics() {
        store.replace(Category.DEVELOPMENT, List.of(1L, 2L),
                Category.DEVELOPMENT, List.of(2L, 1L));

        verify(jdbc, never()).update(any(String.class), any(Object[].class));
    }

    @Test
    void largePairUpdatesAreSplitIntoBoundedStatements() {
        store.apply(Category.DEVELOPMENT, LongStream.rangeClosed(1, 33).boxed().toList(), 1);

        ArgumentCaptor<Object[]> pairArgs = ArgumentCaptor.forClass(Object[].class);
        verify(jdbc, times(2)).update(contains("graph_tag_pair_stats"), pairArgs.capture());
        org.assertj.core.api.Assertions.assertThat(pairArgs.getAllValues())
                .extracting(args -> args.length / 4)
                .containsExactly(500, 28);
    }
}
