-- Compare read plans on the same disposable 100k-note benchmark dataset.
USE graph_bench;

EXPLAIN ANALYZE
SELECT t2.name, COUNT(DISTINCT nt1.note_id) AS co_count
FROM note_tags nt1
JOIN notes n ON n.id = nt1.note_id
JOIN tags t1 ON t1.id = nt1.tag_id
JOIN note_tags nt2 ON nt2.note_id = nt1.note_id
JOIN tags t2 ON t2.id = nt2.tag_id
WHERE n.category = 'DEVELOPMENT' AND n.deleted_at IS NULL
    AND t1.name = 'tag_0001' AND t2.name <> 'tag_0001'
GROUP BY t2.name
ORDER BY co_count DESC, t2.name ASC
LIMIT 6;

EXPLAIN ANALYZE
SELECT r.target_name, r.co_count, r.score
FROM graph_ranked_neighbors r
WHERE r.category = 'DEVELOPMENT'
    AND r.source_tag_id = (SELECT id FROM tags WHERE name = 'tag_0001')
ORDER BY r.score DESC, r.co_count DESC, r.target_name ASC
LIMIT 6;
