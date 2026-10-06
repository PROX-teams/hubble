USE graph_bench;

ALTER TABLE note_tags
    ADD INDEX idx_note_tag_tag_note (tag_id, note_id),
    ADD UNIQUE INDEX uk_note_tags_note_tag (note_id, tag_id);

ANALYZE TABLE note_tags;
