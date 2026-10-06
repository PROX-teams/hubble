-- Run only after graph-benchmark-setup.sql in the disposable graph_bench schema.
USE graph_bench;

CREATE TABLE graph_tag_usage_stats (
    category VARCHAR(32) NOT NULL,
    tag_id BIGINT NOT NULL,
    note_count BIGINT NOT NULL,
    PRIMARY KEY (category, tag_id)
);
INSERT INTO graph_tag_usage_stats
SELECT n.category, nt.tag_id, COUNT(*)
FROM notes n JOIN note_tags nt ON nt.note_id = n.id
GROUP BY n.category, nt.tag_id;

CREATE TABLE graph_tag_pair_stats (
    category VARCHAR(32) NOT NULL,
    tag_a_id BIGINT NOT NULL,
    tag_b_id BIGINT NOT NULL,
    co_count BIGINT NOT NULL,
    PRIMARY KEY (category, tag_a_id, tag_b_id)
);
INSERT INTO graph_tag_pair_stats
SELECT n.category, a.tag_id, b.tag_id, COUNT(*)
FROM notes n
JOIN note_tags a ON a.note_id = n.id
JOIN note_tags b ON b.note_id = n.id AND a.tag_id < b.tag_id
GROUP BY n.category, a.tag_id, b.tag_id;

CREATE TABLE graph_ranked_neighbors (
    category VARCHAR(32) NOT NULL,
    source_tag_id BIGINT NOT NULL,
    target_tag_id BIGINT NOT NULL,
    target_name VARCHAR(30) NOT NULL,
    co_count BIGINT NOT NULL,
    score DECIMAL(20,16) NOT NULL,
    PRIMARY KEY (category, source_tag_id, target_tag_id),
    KEY idx_graph_ranked_read (category, source_tag_id,
        score DESC, co_count DESC, target_name)
);
INSERT INTO graph_ranked_neighbors
SELECT p.category,
    IF(direction.side = 0, p.tag_a_id, p.tag_b_id),
    IF(direction.side = 0, p.tag_b_id, p.tag_a_id),
    t.name, p.co_count,
    ROUND(CAST(p.co_count AS DECIMAL(38,16)) /
        (source.note_count + target.note_count - p.co_count), 16)
FROM graph_tag_pair_stats p
CROSS JOIN (SELECT 0 AS side UNION ALL SELECT 1 AS side) direction
JOIN graph_tag_usage_stats source ON source.category = p.category
    AND source.tag_id = IF(direction.side = 0, p.tag_a_id, p.tag_b_id)
JOIN graph_tag_usage_stats target ON target.category = p.category
    AND target.tag_id = IF(direction.side = 0, p.tag_b_id, p.tag_a_id)
JOIN tags t ON t.id = target.tag_id
WHERE p.co_count >= 2;

SELECT 'notes' AS item, COUNT(*) AS rows_count FROM notes
UNION ALL SELECT 'note_tags', COUNT(*) FROM note_tags
UNION ALL SELECT 'pairs', COUNT(*) FROM graph_tag_pair_stats
UNION ALL SELECT 'ranked_neighbors', COUNT(*) FROM graph_ranked_neighbors;
