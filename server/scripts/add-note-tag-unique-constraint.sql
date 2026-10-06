-- Run once against each existing Hubble database after checking the duplicate
-- query below. The ALTER intentionally fails without changing rows if duplicates
-- exist; resolve those records explicitly before retrying.
SELECT note_id, tag_id, COUNT(*) AS duplicate_count
FROM note_tags
GROUP BY note_id, tag_id
HAVING COUNT(*) > 1;

ALTER TABLE note_tags
    ADD CONSTRAINT uk_note_tags_note_tag UNIQUE (note_id, tag_id);
