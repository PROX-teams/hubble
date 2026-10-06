CREATE TABLE graph_note_outbox (
    seq BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id CHAR(36) NOT NULL,
    note_id BIGINT NOT NULL,
    payload JSON NOT NULL,
    created_at DATETIME(6) NOT NULL,
    published_at DATETIME(6) NULL,
    lease_owner CHAR(36) NULL,
    lease_until DATETIME(6) NULL,
    UNIQUE KEY uk_graph_outbox_id (id),
    KEY idx_graph_outbox_pending (published_at, lease_until, seq),
    KEY idx_graph_outbox_note_order (note_id, seq, published_at)
);

CREATE TABLE graph_processed_events (
    event_id CHAR(36) NOT NULL PRIMARY KEY,
    processed_at DATETIME(6) NOT NULL
);

CREATE TABLE graph_rank_dirty_pairs (
    category VARCHAR(30) NOT NULL,
    tag_a_id BIGINT NOT NULL,
    tag_b_id BIGINT NOT NULL,
    requested_at DATETIME(6) NOT NULL,
    PRIMARY KEY (category, tag_a_id, tag_b_id),
    KEY idx_graph_rank_dirty_requested (requested_at)
);

CREATE TABLE graph_ranked_neighbors (
    category VARCHAR(30) NOT NULL,
    source_tag_id BIGINT NOT NULL,
    target_tag_id BIGINT NOT NULL,
    target_name VARCHAR(30) COLLATE utf8mb4_bin NOT NULL,
    target_usage_count BIGINT NOT NULL,
    co_count BIGINT NOT NULL,
    score DECIMAL(20, 16) NOT NULL,
    PRIMARY KEY (category, source_tag_id, target_tag_id),
    KEY idx_graph_ranked_read (category, source_tag_id,
        score DESC, co_count DESC, target_name)
);
