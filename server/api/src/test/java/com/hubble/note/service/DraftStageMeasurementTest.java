package com.hubble.note.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.DraftSaveRequest;
import com.hubble.note.dto.response.DraftResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.assertj.core.api.Assertions.assertThat;

/** Real service and DB, each numbered service step measured separately. */
@EnabledIfEnvironmentVariable(named = "DRAFT_STAGE_MEASURE", matches = "true")
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:mysql://127.0.0.1:13326/hubble_draft_benchmark?serverTimezone=UTC&characterEncoding=UTF-8",
    "spring.datasource.username=root", "spring.datasource.password=draft-local-test",
    "spring.jpa.show-sql=false", "spring.jpa.properties.hibernate.format_sql=false",
    "graph.worker.enabled=false", "spring.kafka.listener.auto-startup=false"
})
class DraftStageMeasurementTest {
    @Autowired DraftService service;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper json;
    private final AtomicLong sequence = new AtomicLong();
    private final String body = "<p>" + "draft measurement content ".repeat(160) + "</p>";

    @Test void measureStages() throws Exception {
        assertThat(jdbc.queryForObject("SELECT DATABASE()", String.class)).isEqualTo("hubble_draft_benchmark");
        jdbc.update("DELETE FROM drafts");
        jdbc.update("DELETE FROM notes");
        jdbc.update("DELETE FROM stories");
        jdbc.update("DELETE FROM users");
        jdbc.update("INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) VALUES(1,NOW(6),NOW(6),'draft@test.local','test-only','draft','EMAIL')");
        jdbc.update("INSERT INTO stories(id,created_at,updated_at,title,description,user_id,category,view_count,like_count,bookmark_count) VALUES(1,NOW(6),NOW(6),'measure','measure',1,'DEVELOPMENT',0,0,0)");
        jdbc.update("INSERT INTO notes(id,created_at,updated_at,title,content,story_id,user_id,category,view_count,like_count,bookmark_count,popularity_score) VALUES(1,NOW(6),NOW(6),'original','original',1,1,'DEVELOPMENT',0,0,0,0)");
        long noteVersion = jdbc.queryForObject("SELECT content_version FROM notes WHERE id=1", Long.class);
        List<Scenario> scenarios = List.of(
                new Scenario("new-post-first-save", false, false, 1),
                new Scenario("new-post-resave", true, false, 1),
                new Scenario("edit-post-first-save", false, true, 1),
                new Scenario("edit-post-resave", true, true, 1),
                new Scenario("new-post-first-save-concurrent", false, false, 8),
                new Scenario("new-post-resave-concurrent", true, false, 8),
                new Scenario("edit-post-first-save-concurrent", false, true, 8),
                new Scenario("edit-post-resave-concurrent", true, true, 8));
        // Warm every branch with real changing writes before measurement.
        for (Scenario scenario : scenarios) {
            DraftResponse draft = null;
            for (int i=0; i<40; i++) draft = service.saveDraft(1L, request(scenario.update() ? draft : null, scenario.edit(), noteVersion));
        }
        List<Map<String,Object>> results = new ArrayList<>();
        List<Map<String,Object>> raw = new ArrayList<>();
        for (int round=1; round<=3; round++) {
            List<Scenario> order = new ArrayList<>(scenarios);
            Collections.shuffle(order, new Random(4100L+round));
            for (Scenario scenario : order) results.add(run(scenario, round, noteVersion, raw));
        }
        Map<String,Object> report = new LinkedHashMap<>();
        report.put("scope", "Each service step plus proxied service invocation including transaction completion; HTTP/auth/network excluded");
        report.put("unattributedMeaning", "Total minus measured stages: transaction startup/completion, instrumentation and unmeasured service code; NOT pure commit time");
        report.put("bodyUtf8Bytes", body.getBytes(java.nio.charset.StandardCharsets.UTF_8).length);
        report.put("requestsPerScenarioPerRound",160);
        report.put("results", results);
        report.put("requests", raw);
        Path file = Path.of("build/reports/draft-stage-measurement/results.json");
        Files.createDirectories(file.getParent());
        json.writerWithDefaultPrettyPrinter().writeValue(file.toFile(), report);
        assertThat(results).allSatisfy(row -> assertThat(row.get("failures")).isEqualTo(0));
    }
    private DraftSaveRequest request(DraftResponse draft, boolean edit, long noteVersion) {
        return new DraftSaveRequest(draft == null ? null : draft.id(), edit ? 1L : null, edit ? noteVersion : null,
                "measurement-"+sequence.incrementAndGet(), body, Category.DEVELOPMENT, 1L,
                List.of("java","draft"), null, draft == null ? null : draft.version());
    }
    private Map<String,Object> run(Scenario scenario, int round, long noteVersion, List<Map<String,Object>> raw) throws Exception {
        int count=160;
        var observations = new ConcurrentLinkedQueue<Map<String,Object>>();
        var pool = Executors.newFixedThreadPool(scenario.concurrency());
        var ready = new CountDownLatch(scenario.concurrency());
        var start = new CountDownLatch(1);
        var futures = new ArrayList<Future<?>>();
        var fixtures = new ArrayList<DraftResponse>();
        for (int w=0; w<scenario.concurrency(); w++) fixtures.add(scenario.update() ? service.saveDraft(1L,request(null,scenario.edit(),noteVersion)) : null);
        for (int w=0; w<scenario.concurrency(); w++) {
            final int worker=w;
            futures.add(pool.submit(() -> {
                DraftResponse draft=fixtures.get(worker);
                ready.countDown();
                try { start.await(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); }
                for (int i=worker; i<count; i+=scenario.concurrency()) {
                    // Input construction and thread-local setup excluded from timed service call.
                    var payload=request(scenario.update() ? draft : null,scenario.edit(),noteVersion);
                    DraftSaveTiming.begin();
                    long begin=System.nanoTime();
                    String error=null;
                    try { draft=service.saveDraft(1L,payload); }
                    catch (Exception e) { error=e.getClass().getSimpleName(); }
                    finally {
                        long total=System.nanoTime()-begin;
                        var stages=DraftSaveTiming.end();
                        assertThat(stages.keySet()).contains("1.story-check-lock","2.user-query","4.tags-convert","5.draft-create-or-update","6.save-and-flush","7.response-build");
                        if (scenario.edit()) assertThat(stages).containsKey("3.note-query-owner-check");
                        var row=new LinkedHashMap<String,Object>();
                        row.put("scenario",scenario.name()); row.put("round",round); row.put("worker",worker); row.put("request",i);
                        row.put("totalNs",total); row.put("stagesNs",stages);
                        row.put("unattributedNs",total-stages.values().stream().mapToLong(Long::longValue).sum());
                        row.put("error",error);
                        observations.add(row);
                    }
                }
            }));
        }
        ready.await(); long begin=System.nanoTime(); start.countDown();
        try { for (var future:futures) future.get(60,TimeUnit.SECONDS); } finally { pool.shutdownNow(); }
        double seconds=(System.nanoTime()-begin)/1e9;
        raw.addAll(observations);
        long failures=observations.stream().filter(row -> row.get("error") != null).count();
        var summary=new LinkedHashMap<String,Object>();
        summary.put("scenario",scenario.name()); summary.put("round",round); summary.put("concurrency",scenario.concurrency());
        summary.put("attempts",observations.size()); summary.put("failures",(int)failures);
        summary.put("successfulSavesPerSecond",(count-failures)/seconds);
        return summary;
    }
    private record Scenario(String name, boolean update, boolean edit, int concurrency) {}
}
