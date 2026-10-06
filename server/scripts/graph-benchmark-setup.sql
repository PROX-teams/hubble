-- Run only against a disposable MySQL instance. Creates 100,000 synthetic notes
-- and 500,000 note-tag associations; never run against the application database.
CREATE DATABASE graph_bench;
USE graph_bench;

CREATE TABLE digits (n TINYINT PRIMARY KEY);
INSERT INTO digits (n) VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);

CREATE TABLE seq (id BIGINT PRIMARY KEY);
INSERT INTO seq (id)
SELECT 1 + a.n + 10*b.n + 100*c.n + 1000*d.n + 10000*e.n
FROM digits a CROSS JOIN digits b CROSS JOIN digits c
CROSS JOIN digits d CROSS JOIN digits e;

CREATE TABLE notes (
    id BIGINT PRIMARY KEY,
    category VARCHAR(32) NOT NULL,
    deleted_at DATETIME NULL,
    INDEX idx_note_category (category)
);

CREATE TABLE tags (
    id BIGINT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

-- Mirrors the existing single-column foreign-key indexes on note_tags.
CREATE TABLE note_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    note_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    INDEX idx_note_id (note_id),
    INDEX idx_tag_id (tag_id)
);

CREATE TABLE slots (slot TINYINT PRIMARY KEY);
INSERT INTO slots (slot) VALUES (0),(1),(2),(3),(4);

INSERT INTO notes (id, category)
SELECT id,
       CASE WHEN MOD(id, 10) < 7 THEN 'DEVELOPMENT'
            WHEN MOD(id, 10) < 9 THEN 'DESIGN'
            ELSE 'PLANNING' END
FROM seq;

INSERT INTO tags (id, name)
SELECT id, CONCAT('tag_', LPAD(id, 4, '0')) FROM seq WHERE id <= 1000;

-- tag_0001 is intentionally common, so expanding it stresses the join.
INSERT INTO note_tags (note_id, tag_id)
SELECT seq.id,
       CASE WHEN slots.slot = 0 AND MOD(seq.id, 5) = 0 THEN 1
            ELSE 2 + MOD(seq.id * 7 + slots.slot * 97, 999) END
FROM seq CROSS JOIN slots;

DROP TABLE slots;
DROP TABLE seq;
DROP TABLE digits;
