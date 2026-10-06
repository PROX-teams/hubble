ALTER TABLE notes ADD COLUMN content_version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE drafts ADD COLUMN base_note_version BIGINT NULL;
-- Legacy editing drafts have an unknown baseline and require reopening the published note.
