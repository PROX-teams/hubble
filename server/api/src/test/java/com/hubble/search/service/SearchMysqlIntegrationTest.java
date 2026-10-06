package com.hubble.search.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.note.entity.Note;
import com.hubble.note.repository.NoteRepository;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.assertThat;

/** Opt-in only: dedicated disposable MySQL, actual migrations and production search path. */
@EnabledIfEnvironmentVariable(named = "SEARCH_MYSQL_TESTS", matches = "true")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:mysql://127.0.0.1:13316/hubble_search_benchmark?serverTimezone=UTC&characterEncoding=UTF-8",
        "spring.datasource.username=root", "spring.datasource.password=search-local-test",
        "spring.jpa.show-sql=false", "spring.jpa.properties.hibernate.format_sql=false",
        "spring.kafka.listener.auto-startup=false", "graph.async.enabled=false", "graph.worker.enabled=false"
})
class SearchMysqlIntegrationTest {
    private static final long USER = 9_000_001L, STORY = 9_100_001L;
    @Autowired JdbcTemplate jdbc;
    @Autowired NoteRepository notes;
    @Autowired StoryRepository stories;
    @Autowired SearchService search;
    @Autowired TestRestTemplate http;
    @Autowired ObjectMapper json;

    @BeforeEach
    void fixtures() {
        assertThat(jdbc.queryForObject("SELECT DATABASE()", String.class)).isEqualTo("hubble_search_benchmark");
        jdbc.update("DELETE FROM note_tags WHERE note_id >= 9000000");
        jdbc.update("DELETE FROM notes WHERE id >= 9000000");
        jdbc.update("DELETE FROM stories WHERE id >= 9000000");
        jdbc.update("DELETE FROM tags WHERE id >= 9000000");
        jdbc.update("DELETE FROM users WHERE id >= 9000000");
        user(USER, "기록주인");
        story(STORY, "무관한 모음", "일반 기록", USER);
        note(9_200_001L, "무관한 기록", "일반 내용", STORY, USER);
        jdbc.update("INSERT INTO tags(id,name) VALUES(9500001,'무관한분류')");
    }

    @Test @Order(1)
    void migrationsAndTokenConfigurationAreApplied() {
        assertThat(jdbc.queryForObject("SELECT @@ngram_token_size", Integer.class)).isEqualTo(2);
        assertThat(jdbc.queryForObject("SELECT COUNT(DISTINCT INDEX_NAME) FROM information_schema.statistics " +
                "WHERE table_schema=DATABASE() AND index_type='FULLTEXT'", Integer.class)).isEqualTo(4);
        assertThat(jdbc.queryForObject("SELECT IS_NULLABLE FROM information_schema.columns " +
                "WHERE table_schema=DATABASE() AND table_name='notes' AND column_name='story_id'", String.class))
                .isEqualTo("NO");
    }

    @Test @Order(2)
    void titleTiersPrecedeRecencyAndBodyMatches() {
        note(9_200_010L, "트랜잭션", "기록", STORY, USER);
        note(9_200_011L, "트랜잭션 정리", "기록", STORY, USER);
        note(9_200_012L, "DB 트랜잭션 이해", "기록", STORY, USER);
        note(9_200_013L, "DB 공부", "트랜잭션 트랜잭션 트랜잭션", STORY, USER);
        assertThat(noteIds("트랜잭션")).containsExactly(9_200_010L, 9_200_011L, 9_200_012L, 9_200_013L);
    }

    @Test @Order(3)
    void bodyOnlyMatchAlsoDiscoversParentStory() {
        note(9_200_010L, "DB 공부", "트랜잭션 내용을 기록", STORY, USER);
        assertThat(noteIds("트랜잭션")).containsExactly(9_200_010L);
        assertThat(storyIds("트랜잭션")).containsExactly(STORY);
    }

    @Test @Order(4)
    void tagOnlyMatchFindsNoteButNotParentStory() {
        note(9_200_010L, "DB 공부", "일반 기록", STORY, USER);
        jdbc.update("INSERT INTO tags(id,name) VALUES(9500002,'검색태그')");
        jdbc.update("INSERT INTO note_tags(note_id,tag_id) VALUES(9200010,9500002)");
        assertThat(noteIds("검색태그")).containsExactly(9_200_010L);
        assertThat(storyIds("검색태그")).isEmpty();
        assertThat(search.search("검색태그", PageRequest.of(0,10), true,true).tags()).containsExactly("검색태그");
    }

    @Test @Order(5)
    void authorOnlyMatchFindsTheirNotesAndStories() {
        user(9_000_002L, "검색작가");
        story(9_100_002L, "별도 모음", "일반 기록", 9_000_002L);
        note(9_200_010L, "별도 기록", "일반 내용", 9_100_002L, 9_000_002L);
        assertThat(noteIds("검색작가")).containsExactly(9_200_010L);
        assertThat(storyIds("검색작가")).containsExactly(9_100_002L);
    }

    @Test @Order(6)
    void deletedNotesCannotDiscoverParentAndDeletedAuthorsAreExcluded() {
        note(9_200_010L, "삭제주제", "삭제주제 내용", STORY, USER);
        jdbc.update("UPDATE notes SET deleted_at=NOW() WHERE id=9200010");
        assertThat(noteIds("삭제주제")).isEmpty();
        assertThat(storyIds("삭제주제")).isEmpty();
        user(9_000_002L, "검색작가");
        story(9_100_002L, "검색작가 모음", "기록", 9_000_002L);
        note(9_200_011L, "검색작가 기록", "기록", 9_100_002L, 9_000_002L);
        jdbc.update("UPDATE users SET deleted_at=NOW() WHERE id=9000002");
        assertThat(noteIds("검색작가")).isEmpty();
        assertThat(storyIds("검색작가")).isEmpty();
    }

    @Test @Order(7)
    void punctuationAndSingleCharacterUseWorkingLikeFallback() {
        note(9_200_010L, "C++ 공부", "기록", STORY, USER);
        note(9_200_011L, "자바 공부", "기록", STORY, USER);
        assertThat(noteIds("C++")).containsExactly(9_200_010L);
        assertThat(noteIds("자")).containsExactly(9_200_011L);
        assertThat(storyIds("C++")).containsExactly(STORY);
    }

    @Test @Order(8)
    void multipleWordPhraseDoesNotMeanIndependentWords() {
        note(9_200_010L, "자바 트랜잭션", "기록", STORY, USER);
        note(9_200_011L, "기록", "자바를 공부하며 트랜잭션을 정리", STORY, USER);
        assertThat(noteIds("자바 트랜잭션")).containsExactly(9_200_010L);
    }

    @Test @Order(9)
    void stableDatasetPaginationHasNoDuplicatesAndReturnsHasNext() {
        for (int i=0;i<13;i++) note(9_200_010L+i, "페이징주제", "내용", STORY, USER);
        var first = notes.searchNotesSlice("페이징주제", PageRequest.of(0,10));
        var second = notes.searchNotesSlice("페이징주제", PageRequest.of(1,10));
        assertThat(first.getContent()).hasSize(10);
        assertThat(first.hasNext()).isTrue();
        assertThat(second.getContent()).hasSize(3);
        assertThat(second.hasNext()).isFalse();
        var ids = new HashSet<>(first.getContent().stream().map(Note::getId).toList());
        assertThat(second.getContent()).noneMatch(n -> ids.contains(n.getId()));
        for(int i=0;i<13;i++) story(9_100_010L+i,"스토리주제","내용",USER);
        var firstStories=stories.searchStoriesSlice("스토리주제",PageRequest.of(0,10));
        var secondStories=stories.searchStoriesSlice("스토리주제",PageRequest.of(1,10));
        assertThat(firstStories.getContent()).hasSize(10);
        assertThat(firstStories.hasNext()).isTrue();
        assertThat(secondStories.getContent()).hasSize(3);
        assertThat(secondStories.hasNext()).isFalse();
        var storyIds=new HashSet<>(firstStories.getContent().stream().map(Story::getId).toList());
        assertThat(secondStories.getContent()).noneMatch(s -> storyIds.contains(s.getId()));
    }

    @Test @Order(10)
    void actualHttpResponseWorksWithLazyTagsAndFinishedLists() {
        note(9_200_010L, "트랜잭션", "<p>트랜잭션 기록</p>", STORY, USER);
        jdbc.update("INSERT INTO tags(id,name) VALUES(9500002,'트랜잭션')");
        jdbc.update("INSERT INTO note_tags(note_id,tag_id) VALUES(9200010,9500002)");
        var response = http.getForEntity("/api/search?keyword={keyword}&page=0&size=10", Map.class, "트랜잭션");
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        var body = response.getBody();
        assertThat(body).containsEntry("isSearching", true);
        assertThat((List<?>) body.get("tags")).hasSize(1);
        var noteSlice = (Map<?,?>) body.get("notes");
        assertThat((List<?>) noteSlice.get("content")).hasSize(1);
        var note = (Map<?,?>) ((List<?>)noteSlice.get("content")).get(0);
        assertThat(note.get("description")).isEqualTo("트랜잭션 기록");
        var next = search.search("트랜잭션", PageRequest.of(1,10), false,true);
        assertThat(next.tags()).isEmpty();
        assertThat(next.stories().getContent()).isEmpty();
    }

    @Test @Order(100)
    @EnabledIfEnvironmentVariable(named = "SEARCH_BENCHMARK", matches = "true")
    void benchmarkRealMysqlAndCurrentHttpApi() throws Exception {
        int count = Integer.parseInt(System.getenv().getOrDefault("SEARCH_BENCHMARK_NOTES", "20000"));
        seedBenchmark(count);
        var report = new LinkedHashMap<String,Object>();
        report.put("measuredAt", Instant.now().toString());
        report.put("mysqlVersion", jdbc.queryForObject("SELECT VERSION()",String.class));
        report.put("notes", jdbc.queryForObject("SELECT COUNT(*) FROM notes",Long.class));
        report.put("stories", jdbc.queryForObject("SELECT COUNT(*) FROM stories",Long.class));
        report.put("tags", jdbc.queryForObject("SELECT COUNT(*) FROM tags",Long.class));
        report.put("bodyLengths", jdbc.queryForMap("SELECT MIN(CHAR_LENGTH(content)) minChars," +
                "AVG(CHAR_LENGTH(content)) avgChars,MAX(CHAR_LENGTH(content)) maxChars FROM notes WHERE id<9000000"));
        report.put("conditions", "MySQL container 2 CPUs/1536 MiB; synthetic data; warm cache; one client for SQL; " +
                "20 measured pairs after 3 warmups; fulltext predicate vs literal LIKE; candidate sets compared. " +
                "SQL timing includes JDBC/network; API is current production path, no old API baseline.");
        var sqlRows = new ArrayList<Map<String,Object>>();
        for (String keyword : List.of("트랜잭션", "일반기록", "희귀주제", "없는검색어", "자바 트랜잭션")) {
            for (String target : List.of("note_text", "notes", "stories")) {
                String ft = countSql(target,true), like = countSql(target,false);
                var ftArgs = args(target, "\""+keyword+"\"");
                var likeArgs = args(target, "%"+keyword+"%");
                long ftCount = jdbc.queryForObject(ft, Long.class, ftArgs);
                long likeCount = jdbc.queryForObject(like, Long.class, likeArgs);
                String idColumn=target.equals("stories")?"s.id":"n.id";
                var ftIds=new HashSet<>(jdbc.queryForList(ft.replace("SELECT COUNT(*) FROM", "SELECT "+idColumn+" FROM"),Long.class,ftArgs));
                var likeIds=new HashSet<>(jdbc.queryForList(like.replace("SELECT COUNT(*) FROM", "SELECT "+idColumn+" FROM"),Long.class,likeArgs));
                for (int i=0;i<3;i++) { jdbc.queryForObject(ft,Long.class,ftArgs); jdbc.queryForObject(like,Long.class,likeArgs); }
                var ftTimes = new ArrayList<Double>(); var likeTimes = new ArrayList<Double>();
                for(int i=0;i<20;i++) {
                    if(i%2==0) { ftTimes.add(timeCount(ft,ftArgs)); likeTimes.add(timeCount(like,likeArgs)); }
                    else { likeTimes.add(timeCount(like,likeArgs)); ftTimes.add(timeCount(ft,ftArgs)); }
                }
                var row = new LinkedHashMap<String,Object>();
                row.put("target",target); row.put("keyword",keyword);
                row.put("fulltextCandidates",ftCount); row.put("likeCandidates",likeCount);
                row.put("sameCandidates",ftIds.equals(likeIds));
                row.put("fulltext",stats(ftTimes)); row.put("like",stats(likeTimes));
                row.put("fulltextPlan",explain(ft,ftArgs));
                row.put("likePlan",explain(like,likeArgs));
                sqlRows.add(row);
                report.put("sql",sqlRows);
                writeReport(report);
            }
        }
        report.put("sql",sqlRows);
        var apiRows = new ArrayList<Map<String,Object>>();
        for(int concurrency : List.of(1,5,10)) {
            for(int i=0;i<5;i++) request("트랜잭션",0);
            ExecutorService executor = Executors.newFixedThreadPool(concurrency);
            var start = System.nanoTime();
            try {
                List<Callable<Double>> jobs = new ArrayList<>();
                for(int i=0;i<60;i++) {
                    final int index=i;
                    jobs.add(() -> request(List.of("트랜잭션","희귀주제","없는검색어","자바 트랜잭션","C++","자").get(index%6),index%2));
                }
                var times = new ArrayList<Double>();
                for(Future<Double> result : executor.invokeAll(jobs)) times.add(result.get());
                double elapsed=(System.nanoTime()-start)/1e9;
                var row=new LinkedHashMap<String,Object>();
                row.put("concurrency",concurrency); row.put("requests",times.size());
                row.put("latency",stats(times)); row.put("requestsPerSecond",times.size()/elapsed);
                row.put("errors",0); apiRows.add(row);
            } finally { executor.shutdownNow(); }
        }
        report.put("currentApi",apiRows);
        writeReport(report);
    }

    private List<Long> noteIds(String keyword) {
        return notes.searchNotesSlice(keyword,PageRequest.of(0,100)).getContent().stream().map(Note::getId).toList();
    }
    private List<Long> storyIds(String keyword) {
        return stories.searchStoriesSlice(keyword,PageRequest.of(0,100)).getContent().stream().map(Story::getId).toList();
    }
    private void user(long id,String name) {
        jdbc.update("INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) " +
                "VALUES(?,NOW(6),NOW(6),?,'test-only',?,'EMAIL')",id,"search"+id+"@test.local",name);
    }
    private void story(long id,String title,String description,long user) {
        jdbc.update("INSERT INTO stories(id,created_at,updated_at,title,description,user_id,category," +
                "view_count,like_count,bookmark_count) VALUES(?,NOW(6),NOW(6),?,?,?,'DEVELOPMENT',0,0,0)",id,title,description,user);
    }
    private void note(long id,String title,String content,long story,long user) {
        jdbc.update("INSERT INTO notes(id,created_at,updated_at,title,content,story_id,user_id,category," +
                "view_count,like_count,bookmark_count,popularity_score) VALUES(?,'2026-01-01','2026-01-01',?,?,?,?,'DEVELOPMENT',0,0,0,0)",
                id,title,content,story,user);
    }

    private void seedBenchmark(int count) {
        if(jdbc.queryForObject("SELECT COUNT(*) FROM notes WHERE id<9000000",Long.class)>0)
            throw new IllegalStateException("Benchmark expects a fresh disposable database; no existing data is overwritten.");
        for(int i=1;i<=100;i++) user(i, i==2?"주제작가":"필자"+i);
        for(int i=1;i<=1000;i++) story(i,i%100==0?"트랜잭션 모음":"학습 모음 "+i,
                i%80==0?"희귀주제 소개":"일반 소개",(i%100)+1);
        for(int i=1;i<=2000;i++) jdbc.update("INSERT INTO tags(id,name) VALUES(?,?)",i,
                i==1?"트랜잭션":i==2?"희귀주제":"분류"+i);
        List<Object[]> batch=new ArrayList<>();
        for(int i=1;i<=count;i++) {
            String title=i%20==0?"트랜잭션 정리 "+i:"학습 기록 "+i;
            String text="일반기록 개발 경험 성능 설계 테스트 기록. ".repeat(15+(i%4)*15)
                    +(i%50==0?" 트랜잭션 내용 ":"")+(i%1000==0?" 희귀주제 설명 ":"")
                    +(i%100==0?" 자바 트랜잭션 기록 ":"")+(i%200==0?" C++ 실습 ":"");
            if(i%100==0) text += "긴 본문을 포함하는 기술 학습 기록과 구현 경험. ".repeat(400);
            batch.add(new Object[]{i,title,text,(i%1000)+1,(i%100)+1});
            if(batch.size()==500||i==count) {
                jdbc.batchUpdate("INSERT INTO notes(id,created_at,updated_at,title,content,story_id,user_id,category," +
                        "view_count,like_count,bookmark_count,popularity_score) VALUES(?,'2026-01-01','2026-01-01',?,?,?,?,'DEVELOPMENT',0,0,0,0)",batch);
                batch.clear();
            }
        }
        batch.clear();
        for(int i=1;i<=count;i++) {
            batch.add(new Object[]{i,(i%2000)+1}); batch.add(new Object[]{i,((i+53)%2000)+1});
            if(batch.size()>=1000||i==count) { jdbc.batchUpdate("INSERT INTO note_tags(note_id,tag_id) VALUES(?,?)",batch);batch.clear(); }
        }
        jdbc.execute("ANALYZE TABLE users,stories,notes,tags,note_tags");
    }

    private String countSql(String target,boolean ft) {
        String noteMatch=ft?"MATCH(n.title,n.content) AGAINST (? IN BOOLEAN MODE)>0":"(n.title LIKE ? OR n.content LIKE ?)";
        if(target.equals("note_text")) return "SELECT COUNT(*) FROM notes n WHERE n.deleted_at IS NULL AND " +
                (ft?"MATCH(n.title,n.content) AGAINST (? IN BOOLEAN MODE)>0":"(n.title LIKE ? OR n.content LIKE ?)");
        String author=ft?"MATCH(u.nickname) AGAINST (? IN BOOLEAN MODE)>0":"u.nickname LIKE ?";
        if(target.equals("notes")) {
            String tag=ft?"MATCH(t.name) AGAINST (? IN BOOLEAN MODE)>0":"t.name LIKE ?";
            return "SELECT COUNT(*) FROM notes n JOIN users u ON u.id=n.user_id WHERE n.deleted_at IS NULL AND u.deleted_at IS NULL AND ("+
                    noteMatch+" OR "+author+" OR EXISTS(SELECT 1 FROM note_tags nt JOIN tags t ON t.id=nt.tag_id WHERE nt.note_id=n.id AND "+tag+"))";
        }
        String storyMatch=ft?"MATCH(s.title,s.description) AGAINST (? IN BOOLEAN MODE)>0":"(s.title LIKE ? OR s.description LIKE ?)";
        return "SELECT COUNT(*) FROM stories s JOIN users u ON u.id=s.user_id WHERE s.deleted_at IS NULL AND u.deleted_at IS NULL AND ("+
                storyMatch+" OR "+author+" OR EXISTS(SELECT 1 FROM notes n JOIN users nu ON nu.id=n.user_id " +
                "WHERE n.story_id=s.id AND n.deleted_at IS NULL AND nu.deleted_at IS NULL AND "+noteMatch+"))";
    }
    private Object[] args(String target,String value) {
        boolean ft=value.startsWith("\"");
        int count=target.equals("note_text")?(ft?1:2):target.equals("notes")?(ft?3:4):(ft?3:5);
        Object[] args=new Object[count]; Arrays.fill(args,value); return args;
    }
    private double timeCount(String sql,Object[] args) {
        long start=System.nanoTime();jdbc.queryForObject(sql,Long.class,args);return (System.nanoTime()-start)/1e6;
    }
    private double request(String keyword,int page) {
        long start=System.nanoTime();
        var response=http.getForEntity("/api/search?keyword={keyword}&page={page}&size=10",Map.class,keyword,page);
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKeys("tags","stories","notes");
        return (System.nanoTime()-start)/1e6;
    }
    private Map<String,Object> stats(List<Double> values) {
        var sorted=new ArrayList<>(values);Collections.sort(sorted);
        return Map.of("samples",values.size(),"medianMs",percentile(sorted,.5),"p95Ms",percentile(sorted,.95),
                "p99Ms",percentile(sorted,.99),"minMs",sorted.get(0),"maxMs",sorted.get(sorted.size()-1));
    }
    private double percentile(List<Double> sorted,double p) {
        return sorted.get(Math.max(0,(int)Math.ceil(sorted.size()*p)-1));
    }
    private void writeReport(Map<String,Object> report) throws Exception {
        Path path=Path.of("build/reports/search-benchmark/results.json");
        Files.createDirectories(path.getParent());
        json.writerWithDefaultPrettyPrinter().writeValue(path.toFile(),report);
    }
    private Object explain(String sql,Object[] args) {
        try { return jdbc.queryForList("EXPLAIN ANALYZE "+sql,args); }
        catch(org.springframework.dao.DataAccessException error) {
            return Map.of("analyzeError",error.getMessage(),"estimatedPlan",jdbc.queryForList("EXPLAIN "+sql,args));
        }
    }
}
