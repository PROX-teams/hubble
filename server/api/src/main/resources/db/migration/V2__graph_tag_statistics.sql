-- Schema only. Existing note data is backfilled as a controlled, verified operation.
CREATE TABLE IF NOT EXISTS graph_tag_usage_stats (
    category VARCHAR(30) NOT NULL,
    tag_id BIGINT NOT NULL,
    note_count BIGINT NOT NULL,
    PRIMARY KEY (category, tag_id),
    KEY idx_graph_usage_rank (category, note_count DESC, tag_id),
    CONSTRAINT fk_graph_usage_tag FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS graph_tag_pair_stats (
    category VARCHAR(30) NOT NULL,
    tag_a_id BIGINT NOT NULL,
    tag_b_id BIGINT NOT NULL,
    co_count BIGINT NOT NULL,
    PRIMARY KEY (category, tag_a_id, tag_b_id),
    KEY idx_graph_pair_reverse (category, tag_b_id, tag_a_id),
    CONSTRAINT fk_graph_pair_tag_a FOREIGN KEY (tag_a_id) REFERENCES tags(id),
    CONSTRAINT fk_graph_pair_tag_b FOREIGN KEY (tag_b_id) REFERENCES tags(id)
);
