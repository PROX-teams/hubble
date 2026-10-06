-- Read-only checks after graph-rank-backfill.sql. All values must be zero.
SELECT 'missing_forward_rank_rows' AS check_name, COUNT(*) AS mismatch_count
FROM graph_tag_pair_stats p
LEFT JOIN graph_ranked_neighbors forward ON forward.category = p.category
    AND forward.source_tag_id = p.tag_a_id AND forward.target_tag_id = p.tag_b_id
WHERE p.co_count >= 2 AND forward.target_tag_id IS NULL;

SELECT 'missing_reverse_rank_rows' AS check_name, COUNT(*) AS mismatch_count
FROM graph_tag_pair_stats p
LEFT JOIN graph_ranked_neighbors reverse_row ON reverse_row.category = p.category
    AND reverse_row.source_tag_id = p.tag_b_id AND reverse_row.target_tag_id = p.tag_a_id
WHERE p.co_count >= 2 AND reverse_row.target_tag_id IS NULL;

SELECT 'extra_rank_rows' AS check_name, COUNT(*) AS mismatch_count
FROM graph_ranked_neighbors r
LEFT JOIN graph_tag_pair_stats p ON p.category = r.category
    AND p.tag_a_id = LEAST(r.source_tag_id, r.target_tag_id)
    AND p.tag_b_id = GREATEST(r.source_tag_id, r.target_tag_id)
WHERE p.tag_a_id IS NULL OR p.co_count < 2;

SELECT 'rank_score_mismatches' AS check_name, COUNT(*) AS mismatch_count
FROM graph_ranked_neighbors r
JOIN graph_tag_usage_stats source ON source.category = r.category AND source.tag_id = r.source_tag_id
JOIN graph_tag_usage_stats target ON target.category = r.category AND target.tag_id = r.target_tag_id
JOIN graph_tag_pair_stats p ON p.category = r.category
    AND p.tag_a_id = LEAST(r.source_tag_id, r.target_tag_id)
    AND p.tag_b_id = GREATEST(r.source_tag_id, r.target_tag_id)
WHERE r.co_count <> p.co_count OR r.target_usage_count <> target.note_count
    OR ABS(r.score - CAST(p.co_count AS DECIMAL(38, 16)) /
        (source.note_count + target.note_count - p.co_count)) > 0.0000000000000001;
