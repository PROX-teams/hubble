package com.hubble.note.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.DraftSaveRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import static org.assertj.core.api.Assertions.assertThat;

/** Opt-in measurement against a disposable DB; measures service calls including commit, not HTTP. */
@EnabledIfEnvironmentVariable(named="DRAFT_MEASURE", matches="true")
@SpringBootTest(properties={
    "spring.datasource.url=jdbc:mysql://127.0.0.1:13326/hubble_draft_benchmark?serverTimezone=UTC&characterEncoding=UTF-8",
    "spring.datasource.username=root", "spring.datasource.password=draft-local-test",
    "spring.jpa.show-sql=false", "spring.jpa.properties.hibernate.format_sql=false",
    "graph.worker.enabled=false", "spring.kafka.listener.auto-startup=false"
})
class DraftMeasurementTest {
    @Autowired DraftService service;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper json;
    private final java.util.concurrent.atomic.AtomicLong sequence=new java.util.concurrent.atomic.AtomicLong();
    private final String body="<p>"+"draft measurement content ".repeat(160)+"</p>";

    @Test void measure() throws Exception {
        assertThat(jdbc.queryForObject("SELECT DATABASE()",String.class)).isEqualTo("hubble_draft_benchmark");
        jdbc.update("DELETE FROM drafts");
        jdbc.update("DELETE FROM stories");
        jdbc.update("DELETE FROM users");
        jdbc.update("INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) VALUES(1,NOW(6),NOW(6),'draft@test.local','test-only','draft','EMAIL')");
        for(long id=1;id<=8;id++) jdbc.update("INSERT INTO stories(id,created_at,updated_at,title,description,user_id,category,view_count,like_count,bookmark_count) VALUES(?,NOW(6),NOW(6),'measure','measure',1,'DEVELOPMENT',0,0,0)",id);
        // Warm the creation path before recorded runs.
        for(int i=0;i<40;i++) service.saveDraft(1L,request(null,null,1L));
        var rows=new ArrayList<Map<String,Object>>();
        for(int round=1;round<=3;round++) {
            rows.add(run("create-shared-story",1,round));
            rows.add(run("create-shared-story",8,round));
            rows.add(run("create-distinct-stories",8,round));
            rows.add(run("update-shared-story",8,round));
            rows.add(run("update-distinct-stories",8,round));
        }
        var report=new LinkedHashMap<String,Object>();
        report.put("scope","Spring service invocation including transaction completion; excludes HTTP/auth/network");
        report.put("requestsPerScenario",160); report.put("bodyUtf8Bytes",body.getBytes(java.nio.charset.StandardCharsets.UTF_8).length);
        report.put("results",rows);
        Path file=Path.of("build/reports/draft-measurement/results.json");
        Files.createDirectories(file.getParent()); json.writerWithDefaultPrettyPrinter().writeValue(file.toFile(),report);
        assertThat(rows).allSatisfy(row->assertThat(row.get("failures")).isEqualTo(0));
    }
    private DraftSaveRequest request(Long id,Long version,Long story) {
        return new DraftSaveRequest(id,null,null,"measurement-"+sequence.incrementAndGet(),body,Category.DEVELOPMENT,story,List.of("java","draft"),null,version);
    }
    private Map<String,Object> run(String scenario,int concurrency,int round) throws Exception {
        int count=160;
        var samples=new ConcurrentLinkedQueue<Double>();
        var errors=new ConcurrentLinkedQueue<String>();
        var executor=Executors.newFixedThreadPool(concurrency);
        var ready=new CountDownLatch(concurrency); var start=new CountDownLatch(1);
        var futures=new ArrayList<Future<?>>();
        boolean update=scenario.startsWith("update");
        // Fixtures are outside measured time. Each worker updates its own draft.
        var drafts=new ArrayList<com.hubble.note.dto.response.DraftResponse>();
        if(update) for(int w=0;w<concurrency;w++) drafts.add(service.saveDraft(1L,request(null,null,scenario.contains("distinct")?(long)w+1:1L)));
        for(int w=0;w<concurrency;w++) {
            final int worker=w;
            futures.add(executor.submit(()->{
                var draft=update?drafts.get(worker):null;
                ready.countDown();
                try {start.await();} catch(InterruptedException e){Thread.currentThread().interrupt(); throw new RuntimeException(e);}
                for(int i=worker;i<count;i+=concurrency){
                    long begin=System.nanoTime();
                    try {
                        draft=service.saveDraft(1L,request(update?draft.id():null,update?draft.version():null,scenario.contains("distinct")?(long)worker+1:1L));
                    } catch(Exception e){errors.add(e.getClass().getSimpleName());}
                    samples.add((System.nanoTime()-begin)/1_000_000.0);
                }
            }));
        }
        ready.await(); long begin=System.nanoTime(); start.countDown();
        try{for(var future:futures)future.get(60,TimeUnit.SECONDS);}finally{executor.shutdownNow();}
        double seconds=(System.nanoTime()-begin)/1_000_000_000.0;
        var sorted=samples.stream().sorted().toList();
        var row=new LinkedHashMap<String,Object>();
        row.put("scenario",scenario); row.put("concurrency",concurrency);row.put("round",round);
        row.put("attempts",sorted.size());row.put("failures",errors.size());row.put("failureTypes",errors.stream().distinct().toList());
        row.put("successfulSavesPerSecond",(count-errors.size())/seconds);
        row.put("p50Ms",sorted.get((int)Math.ceil(count*.50)-1));
        row.put("p95Ms",sorted.get((int)Math.ceil(count*.95)-1));
        row.put("p99Ms",sorted.get((int)Math.ceil(count*.99)-1));
        return row;
    }
}
