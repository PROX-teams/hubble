-- Run once after graph-stats-schema.sql, with note writes paused.
-- This rebuilds the derived tables from active notes; do not run concurrently with writes.
START TRANSACTION;
DELETE FROM graph_tag_pair_stats;
DELETE FROM graph_tag_usage_stats;

INSERT INTO graph_tag_usage_stats(category, tag_id, note_count)
SELECT n.category, nt.tag_id, COUNT(*)
FROM notes n JOIN note_tags nt ON nt.note_id = n.id
WHERE n.deleted_at IS NULL
GROUP BY n.category, nt.tag_id;

INSERT INTO graph_tag_pair_stats(category, tag_a_id, tag_b_id, co_count)
SELECT n.category, a.tag_id, b.tag_id, COUNT(*)
FROM notes n
JOIN note_tags a ON a.note_id = n.id
JOIN note_tags b ON b.note_id = n.id AND a.tag_id < b.tag_id
WHERE n.deleted_at IS NULL
GROUP BY n.category, a.tag_id, b.tag_id;
COMMIT;

-- Both totals should equal the number of active note-tag links.
SELECT COALESCE(SUM(note_count), 0) AS usage_total FROM graph_tag_usage_stats;
SELECT COUNT(*) AS original_total FROM note_tags nt JOIN notes n ON n.id = nt.note_id WHERE n.deleted_at IS NULL;
