package com.hubble.graph.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

class GraphChangeRecorderTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final GraphChangeRecorder recorder = new GraphChangeRecorder(jdbc, new ObjectMapper());

    @Test
    void recordsOutboxForEveryNoteChange() throws Exception {
        recorder.record(1L, null, List.of(), Category.DEVELOPMENT, List.of(2L, 3L));
        recorder.record(1L, Category.DEVELOPMENT, List.of(2L, 3L), Category.DESIGN, List.of(2L));
        recorder.record(1L, Category.DESIGN, List.of(2L), null, List.of());

        ArgumentCaptor<String> payloads = ArgumentCaptor.forClass(String.class);
        verify(jdbc, times(3)).update(org.mockito.ArgumentMatchers.contains("graph_note_outbox"),
                anyString(), eq(1L), payloads.capture());
        ObjectMapper mapper = new ObjectMapper();
        GraphNoteChange create = mapper.readValue(payloads.getAllValues().get(0), GraphNoteChange.class);
        GraphNoteChange update = mapper.readValue(payloads.getAllValues().get(1), GraphNoteChange.class);
        GraphNoteChange delete = mapper.readValue(payloads.getAllValues().get(2), GraphNoteChange.class);
        org.assertj.core.api.Assertions.assertThat(create.oldCategory()).isNull();
        org.assertj.core.api.Assertions.assertThat(create.newTagIds()).containsExactly(2L, 3L);
        org.assertj.core.api.Assertions.assertThat(update.oldTagIds()).containsExactly(2L, 3L);
        org.assertj.core.api.Assertions.assertThat(update.newCategory()).isEqualTo(Category.DESIGN);
        org.assertj.core.api.Assertions.assertThat(update.newTagIds()).containsExactly(2L);
        org.assertj.core.api.Assertions.assertThat(delete.oldTagIds()).containsExactly(2L);
        org.assertj.core.api.Assertions.assertThat(delete.newCategory()).isNull();
        org.assertj.core.api.Assertions.assertThat(delete.newTagIds()).isEmpty();
        org.mockito.Mockito.verifyNoMoreInteractions(jdbc);

    }
}
