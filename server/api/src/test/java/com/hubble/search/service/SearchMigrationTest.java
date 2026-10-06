package com.hubble.search.service;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

import java.sql.DriverManager;

import static org.assertj.core.api.Assertions.assertThat;

/** Verifies the legacy-data backfill, not just migration against empty tables. */
@EnabledIfEnvironmentVariable(named = "SEARCH_MYSQL_TESTS", matches = "true")
class SearchMigrationTest {
    @Test
    void v6RepairsMissingStoriesAndPreservesExistingAssignments() throws Exception {
        String admin="jdbc:mysql://127.0.0.1:13316/?serverTimezone=UTC";
        String url="jdbc:mysql://127.0.0.1:13316/hubble_search_migration?serverTimezone=UTC&characterEncoding=UTF-8";
        try(var connection=DriverManager.getConnection(admin,"root","search-local-test");var sql=connection.createStatement()) {
            sql.execute("CREATE DATABASE hubble_search_migration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        }
        try {
            Flyway.configure().dataSource(url,"root","search-local-test").target("5").load().migrate();
            try(var connection=DriverManager.getConnection(url,"root","search-local-test");var sql=connection.createStatement()) {
                sql.executeUpdate("INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) VALUES " +
                        "(1,NOW(),NOW(),'one@test.local','test','첫필자','EMAIL'),"+
                        "(2,NOW(),NOW(),'two@test.local','test','둘째필자','EMAIL')");
                sql.executeUpdate("INSERT INTO stories(id,created_at,updated_at,title,category,user_id,view_count,like_count,bookmark_count) VALUES " +
                        "(1,NOW(),NOW(),'기본 폴더','OTHER',1,0,0,0),(2,NOW(),NOW(),'전용 폴더','OTHER',2,0,0,0)");
                sql.executeUpdate("INSERT INTO notes(id,created_at,updated_at,title,content,category,user_id,story_id,"+
                        "view_count,like_count,bookmark_count,popularity_score,deleted_at) VALUES " +
                        "(1,NOW(),NOW(),'기록','내용','OTHER',1,NULL,0,0,0,0,NULL),"+
                        "(2,NOW(),NOW(),'기록','내용','OTHER',2,NULL,0,0,0,0,NULL),"+
                        "(3,NOW(),NOW(),'기록','내용','OTHER',2,NULL,0,0,0,0,NOW()),"+
                        "(4,NOW(),NOW(),'기록','내용','OTHER',2,2,0,0,0,0,NULL)");
            }
            Flyway.configure().dataSource(url,"root","search-local-test").load().migrate();
            try(var connection=DriverManager.getConnection(url,"root","search-local-test");var sql=connection.createStatement()) {
                try(var result=sql.executeQuery("SELECT COUNT(*) FROM notes WHERE story_id IS NULL")) {
                    result.next();assertThat(result.getInt(1)).isZero();
                }
                try(var result=sql.executeQuery("SELECT story_id FROM notes WHERE id IN(1,4) ORDER BY id")) {
                    result.next();assertThat(result.getLong(1)).isEqualTo(1);
                    result.next();assertThat(result.getLong(1)).isEqualTo(2);
                }
                try(var result=sql.executeQuery("SELECT COUNT(*) FROM notes n JOIN stories s ON s.id=n.story_id " +
                        "WHERE n.id IN(2,3) AND s.title='기본 폴더' AND s.user_id=2")) {
                    result.next();assertThat(result.getInt(1)).isEqualTo(2);
                }
            }
        } finally {
            try(var connection=DriverManager.getConnection(admin,"root","search-local-test");var sql=connection.createStatement()) {
                sql.execute("DROP DATABASE hubble_search_migration");
            }
        }
    }
}
