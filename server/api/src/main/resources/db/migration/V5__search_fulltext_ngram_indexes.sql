-- Integrated search uses MySQL's built-in ngram parser for Korean text.
-- One-character and symbol-only keywords continue to use the LIKE fallback.
-- Keep an empty stopword list so common English terms (for example, "in") are searchable.
CREATE TABLE search_stopwords (
    value VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

SET SESSION innodb_ft_user_stopword_table = CONCAT(DATABASE(), '/search_stopwords');

ALTER TABLE notes
    ADD FULLTEXT INDEX ft_notes_title_content (title, content) WITH PARSER ngram;

ALTER TABLE stories
    ADD FULLTEXT INDEX ft_stories_title_description (title, description) WITH PARSER ngram;

ALTER TABLE users
    ADD FULLTEXT INDEX ft_users_nickname (nickname) WITH PARSER ngram;

ALTER TABLE tags
    ADD FULLTEXT INDEX ft_tags_name (name) WITH PARSER ngram;

SET SESSION innodb_ft_user_stopword_table = DEFAULT;
