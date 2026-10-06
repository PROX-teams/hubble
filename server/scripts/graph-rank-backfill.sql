-- Run with note writes paused after V4 and graph-stats-backfill.sql.
-- This controlled rebuild is only for initial cutover or disaster recovery.
START TRANSACTION;
DELETE FROM graph_ranked_neighbors;
DELETE FROM graph_rank_dirty_pairs;

INSERT INTO graph_ranked_neighbors(category, source_tag_id, target_tag_id,
    target_name, target_usage_count, co_count, score)
SELECT p.category, p.tag_a_id, p.tag_b_id, t.name,
       target.note_count, p.co_count,
       ROUND(CAST(p.co_count AS DECIMAL(38, 16)) /
           (source.note_count + target.note_count - p.co_count), 16)
FROM graph_tag_pair_stats p
JOIN graph_tag_usage_stats source ON source.category = p.category AND source.tag_id = p.tag_a_id
JOIN graph_tag_usage_stats target ON target.category = p.category AND target.tag_id = p.tag_b_id
JOIN tags t ON t.id = p.tag_b_id
WHERE p.co_count >= 2 AND source.note_count > 0 AND target.note_count > 0;

INSERT INTO graph_ranked_neighbors(category, source_tag_id, target_tag_id,
    target_name, target_usage_count, co_count, score)
SELECT p.category, p.tag_b_id, p.tag_a_id, t.name,
       target.note_count, p.co_count,
       ROUND(CAST(p.co_count AS DECIMAL(38, 16)) /
           (source.note_count + target.note_count - p.co_count), 16)
FROM graph_tag_pair_stats p
JOIN graph_tag_usage_stats source ON source.category = p.category AND source.tag_id = p.tag_b_id
JOIN graph_tag_usage_stats target ON target.category = p.category AND target.tag_id = p.tag_a_id
JOIN tags t ON t.id = p.tag_a_id
WHERE p.co_count >= 2 AND source.note_count > 0 AND target.note_count > 0;
COMMIT;
