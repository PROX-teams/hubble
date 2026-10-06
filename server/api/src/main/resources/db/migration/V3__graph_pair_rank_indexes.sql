-- Support keyset paging of each side of a tag's pair relationships.
-- The existing primary/reverse keys remain for pair identity and direct lookups.
CREATE INDEX idx_graph_pair_a_rank
    ON graph_tag_pair_stats (category, tag_a_id, co_count DESC, tag_b_id);

CREATE INDEX idx_graph_pair_b_rank
    ON graph_tag_pair_stats (category, tag_b_id, co_count DESC, tag_a_id);
