-- Read-only verification. Run after backfill and after write-path integration tests.
-- Both mismatch counts must be zero. A total-only check cannot detect offsetting errors.
SELECT 'usage_mismatches' AS check_name, COUNT(*) AS mismatch_count
FROM (
    SELECT CAST(n.category AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS category,
        nt.tag_id, COUNT(*) AS expected_count
    FROM notes n JOIN note_tags nt ON nt.note_id = n.id
    WHERE n.deleted_at IS NULL
    GROUP BY n.category, nt.tag_id
) expected
LEFT JOIN graph_tag_usage_stats actual
    ON actual.category = expected.category AND actual.tag_id = expected.tag_id
WHERE actual.tag_id IS NULL OR actual.note_count <> expected.expected_count;

SELECT 'pair_mismatches' AS check_name, COUNT(*) AS mismatch_count
FROM (
    SELECT CAST(n.category AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS category,
        a.tag_id AS tag_a_id, b.tag_id AS tag_b_id, COUNT(*) AS expected_count
    FROM notes n
    JOIN note_tags a ON a.note_id = n.id
    JOIN note_tags b ON b.note_id = n.id AND a.tag_id < b.tag_id
    WHERE n.deleted_at IS NULL
    GROUP BY n.category, a.tag_id, b.tag_id
) expected
LEFT JOIN graph_tag_pair_stats actual
    ON actual.category = expected.category
    AND actual.tag_a_id = expected.tag_a_id AND actual.tag_b_id = expected.tag_b_id
WHERE actual.tag_a_id IS NULL OR actual.co_count <> expected.expected_count;

-- Unexpected positive rows must also be absent. Zero rows are retained deliberately.
SELECT 'extra_usage_rows' AS check_name, COUNT(*) AS mismatch_count
FROM graph_tag_usage_stats actual
LEFT JOIN (
    SELECT CAST(n.category AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS category,
        nt.tag_id
    FROM notes n JOIN note_tags nt ON nt.note_id = n.id
    WHERE n.deleted_at IS NULL
    GROUP BY n.category, nt.tag_id
) expected ON expected.category = actual.category AND expected.tag_id = actual.tag_id
WHERE actual.note_count <> 0 AND expected.tag_id IS NULL;

SELECT 'extra_pair_rows' AS check_name, COUNT(*) AS mismatch_count
FROM graph_tag_pair_stats actual
LEFT JOIN (
    SELECT CAST(n.category AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci AS category,
        a.tag_id AS tag_a_id, b.tag_id AS tag_b_id
    FROM notes n
    JOIN note_tags a ON a.note_id = n.id
    JOIN note_tags b ON b.note_id = n.id AND a.tag_id < b.tag_id
    WHERE n.deleted_at IS NULL
    GROUP BY n.category, a.tag_id, b.tag_id
) expected ON expected.category = actual.category
    AND expected.tag_a_id = actual.tag_a_id AND expected.tag_b_id = actual.tag_b_id
WHERE actual.co_count <> 0 AND expected.tag_a_id IS NULL;
