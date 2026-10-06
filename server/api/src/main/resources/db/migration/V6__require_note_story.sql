-- Repair legacy notes without a story before enforcing the constraint.
INSERT INTO stories (
    created_at, updated_at, title, description, category, user_id,
    view_count, like_count, bookmark_count
)
SELECT DISTINCT CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
       '기본 폴더', '기본으로 생성된 폴더입니다.', 'OTHER', n.user_id, 0, 0, 0
FROM notes n
WHERE n.story_id IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM stories s
      WHERE s.user_id = n.user_id
        AND s.title = '기본 폴더'
        AND s.deleted_at IS NULL
  );

UPDATE notes n
JOIN (
    SELECT user_id, MIN(id) AS story_id
    FROM stories
    WHERE title = '기본 폴더' AND deleted_at IS NULL
    GROUP BY user_id
) defaults ON defaults.user_id = n.user_id
SET n.story_id = defaults.story_id
WHERE n.story_id IS NULL;

ALTER TABLE notes
    DROP FOREIGN KEY FK9yx1roo78wsdvgmmecdsbh3mt,
    MODIFY COLUMN story_id BIGINT NOT NULL,
    ADD CONSTRAINT fk_notes_required_story
        FOREIGN KEY (story_id) REFERENCES stories(id);
