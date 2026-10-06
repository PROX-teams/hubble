ALTER TABLE stories ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT FALSE;
-- Preserve existing folders; choose the oldest active matching folder as the default.
UPDATE stories s
JOIN (SELECT user_id, MIN(id) AS default_id FROM stories
      WHERE title = '기본 폴더' AND deleted_at IS NULL GROUP BY user_id) defaults
ON s.id = defaults.default_id
SET s.is_default = TRUE;
ALTER TABLE stories
    ADD COLUMN active_default_owner BIGINT GENERATED ALWAYS AS
        (CASE WHEN is_default = TRUE AND deleted_at IS NULL THEN user_id ELSE NULL END) STORED,
    ADD UNIQUE KEY uk_story_active_default_owner (active_default_owner);
