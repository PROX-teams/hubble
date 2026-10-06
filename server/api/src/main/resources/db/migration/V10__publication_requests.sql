CREATE TABLE publication_requests (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    request_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    response_json TEXT NOT NULL,
    CONSTRAINT uk_publication_user_key UNIQUE (user_id, request_key)
);
