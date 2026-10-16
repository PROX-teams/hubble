package com.hubble.note.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.DraftSaveRequest;
import com.hubble.note.dto.response.DraftResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.sql.DataSource;
import java.lang.reflect.*;
import java.nio.file.*;
import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import static org.assertj.core.api.Assertions.assertThat;

/** Dedicated real DB. JDBC wrappers and lock polling are enabled in this test only. */
@EnabledIfEnvironmentVariable(named="NOTE_WRITE_MEASURE", matches="true")
@Import(NoteWriteMeasurementTest.Probes.class)
@SpringBootTest(properties={
    "bench.note.probes=true",
    "spring.datasource.url=jdbc:mysql://127.0.0.1:13326/hubble_draft_benchmark?serverTimezone=UTC&characterEncoding=UTF-8",
    "spring.datasource.username=root", "spring.datasource.password=draft-local-test",
    "spring.jpa.show-sql=false", "spring.jpa.properties.hibernate.format_sql=false",
    "graph.worker.enabled=false", "spring.kafka.listener.auto-startup=false"
})
class NoteWriteMeasurementTest {
    @Autowired NoteService notes;
    @Autowired PublicationService publications;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper json;
    private static final String URL="jdbc:mysql://127.0.0.1:13326/hubble_draft_benchmark?serverTimezone=UTC&characterEncoding=UTF-8";
    private final AtomicLong seq=new AtomicLong();
    private final String body="<p>"+"draft measurement content ".repeat(160)+"</p>";
    private static final ThreadLocal<Trace> TRACE=new ThreadLocal<>();
    private static final class Trace {
        final Map<String,Long> timings=new LinkedHashMap<>();
        String sql;
        long storyQueryReturned;
        void add(String name,long ns){timings.merge(name,ns,Long::sum);}
    }
    private static Object invoke(Object target,Method method,Object[] args) throws Throwable {
        try{return method.invoke(target,args);}catch(InvocationTargetException e){throw e.getCause();}
    }
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name="bench.note.probes", havingValue="true")
    @TestConfiguration(proxyBeanMethods=false)
    static class Probes {
        @Bean static BeanPostProcessor jdbcTiming() {
            return new BeanPostProcessor() {
                @Override public Object postProcessAfterInitialization(Object bean,String name) {
                    if(!(bean instanceof DataSource))return bean;
                    return Proxy.newProxyInstance(DataSource.class.getClassLoader(),new Class<?>[]{DataSource.class},(proxy,method,args)->{
                        long start=System.nanoTime();
                        Object result;
                        try{result=invoke(bean,method,args);}finally{
                            Trace trace=TRACE.get();
                            if(trace!=null&&method.getName().equals("getConnection"))trace.add("connectionAcquireNs",System.nanoTime()-start);
                        }
                        return result instanceof Connection ? connection((Connection)result) : result;
                    });
                }
            };
        }
        static Connection connection(Connection target) {
            return (Connection)Proxy.newProxyInstance(Connection.class.getClassLoader(),new Class<?>[]{Connection.class},(proxy,method,args)->{
                long start=System.nanoTime();
                Object result;
                try{result=invoke(target,method,args);}finally{
                    Trace trace=TRACE.get();
                    if(trace!=null&&method.getName().equals("commit")){
                        long end=System.nanoTime();trace.add("jdbcCommitNs",end-start);
                        if(trace.storyQueryReturned!=0)trace.add("storyQueryReturnToCommitEndNs",end-trace.storyQueryReturned);
                    }
                }
                if(result instanceof PreparedStatement&&args!=null&&args.length>0&&args[0] instanceof String){
                    String sql=(String)args[0];
                    String lower=sql.toLowerCase(Locale.ROOT);
                    return statement((PreparedStatement)result,sql);
                }
                return result;
            });
        }
        static PreparedStatement statement(PreparedStatement target,String sql) {
            return (PreparedStatement)Proxy.newProxyInstance(PreparedStatement.class.getClassLoader(),new Class<?>[]{PreparedStatement.class},(proxy,method,args)->{
                boolean execute=method.getName().startsWith("execute");
                long start=System.nanoTime();
                try{return invoke(target,method,args);}finally{
                    Trace trace=TRACE.get();
                    if(trace!=null&&execute){
                        long end=System.nanoTime();String lower = sql.toLowerCase(Locale.ROOT);
                        String part = lower.contains("publication_requests") ? "publication-record"
                                : lower.contains("note_tags") ? "note-tags"
                                : lower.contains("graph_note_outbox") ? "outbox"
                                : lower.contains("from stories") ? "story-lock"
                                : lower.contains("insert into tags") ? "tag-upsert"
                                : lower.contains("from tags") ? "tag-query"
                                : lower.contains("notes") ? "note"
                                : lower.contains("drafts") ? "draft" : "other";
                        trace.add("sql."+part, end-start);
                        trace.sql=sql;
                        if (part.equals("story-lock")) trace.storyQueryReturned=end;
                    }
                }
            });
        }
    }
    @Test void measureWrites() throws Exception {
        assertThat(jdbc.queryForObject("SELECT DATABASE()",String.class)).isEqualTo("hubble_draft_benchmark");
        jdbc.update("DELETE FROM publication_requests");jdbc.update("DELETE FROM graph_note_outbox");
        jdbc.update("DELETE FROM note_tags");jdbc.update("DELETE FROM drafts");jdbc.update("DELETE FROM notes");
        jdbc.update("DELETE FROM stories");jdbc.update("DELETE FROM tags");jdbc.update("DELETE FROM users");
        for(int i=1;i<=8;i++){
            jdbc.update("INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) VALUES(?,NOW(6),NOW(6),?,'test-only','writer','EMAIL')",i,"writer"+i+"@test.local");
            jdbc.update("INSERT INTO stories(id,created_at,updated_at,title,description,user_id,category,view_count,like_count,bookmark_count) VALUES(?,NOW(6),NOW(6),'measure','measure',?,'DEVELOPMENT',0,0,0)",i,i);
        }
        List<Scenario> scenarios=new ArrayList<>();
        for(String operation:List.of("create","update-body","update-tags")){
            scenarios.add(new Scenario(operation+"-sequential",operation,1,false));
            scenarios.add(new Scenario(operation+"-shared",operation,8,false));
            scenarios.add(new Scenario(operation+"-distributed",operation,8,true));
        }
        for(Scenario s:scenarios){
            com.hubble.note.dto.response.NoteResponse note=null;
            for(int i=0;i<40;i++){
                var payload=request(note,List.of("java","draft"));
                note=note==null||s.operation().equals("create")
                        ? publications.publish(1L,UUID.randomUUID().toString(),payload)
                        : notes.updateNote(1L,note.id(),payload);
            }
        }
        List<Map<String,Object>> summaries=new ArrayList<>(),raw=new ArrayList<>(),locks=new ArrayList<>();
        try(Connection observer=DriverManager.getConnection(URL,"root","draft-local-test")){
            for(int round=1;round<=3;round++){
                var order=new ArrayList<>(scenarios);Collections.shuffle(order,new Random(9400L+round));
                for(Scenario s:order)summaries.add(run(s,round,observer,raw,locks));
            }
        }
        var report=new LinkedHashMap<String,Object>();
        report.put("scope","Actual publication/update service calls including transaction completion; optional drafts excluded from this load, covered by separate correctness tests");
        report.put("variant",System.getenv().getOrDefault("NOTE_WRITE_VARIANT","before"));
        report.put("requestsPerRound",96);report.put("summaries",summaries);report.put("requests",raw);report.put("lockSnapshots",locks);
        Path file=Path.of("build/reports/note-write-measurement/"+System.getenv().getOrDefault("NOTE_WRITE_VARIANT","before")+".json");
        Files.createDirectories(file.getParent());json.writerWithDefaultPrettyPrinter().writeValue(file.toFile(),report);
        assertThat(summaries).allSatisfy(row->assertThat(row.get("failures")).isEqualTo(0));
    }
    private com.hubble.note.dto.request.NoteCreateRequest request(com.hubble.note.dto.response.NoteResponse note,List<String> tags){
        return new com.hubble.note.dto.request.NoteCreateRequest("measurement-"+seq.incrementAndGet(),body,Category.DEVELOPMENT,null,tags,note==null?1L:note.storyId(),null,null,note==null?null:note.version());
    }
    private Map<String,Long> counters(Connection observer)throws SQLException{
        var result=new LinkedHashMap<String,Long>();
        try(Statement st=observer.createStatement();ResultSet rs=st.executeQuery("SHOW GLOBAL STATUS WHERE Variable_name IN ('Innodb_row_lock_time','Innodb_row_lock_waits')")){
            while(rs.next())result.put(rs.getString(1).toLowerCase(Locale.ROOT),rs.getLong(2));
        }
        assertThat(result).containsKeys("innodb_row_lock_time","innodb_row_lock_waits");return result;
    }
    private List<Map<String,Object>> lockSnapshot(Connection observer)throws SQLException{
        List<Map<String,Object>> result=new ArrayList<>();
        String sql="SELECT r.OBJECT_NAME AS wait_table,r.INDEX_NAME AS wait_index,r.LOCK_TYPE AS wait_type,r.LOCK_MODE AS wait_mode,r.LOCK_STATUS AS wait_status,r.LOCK_DATA AS wait_key,b.LOCK_MODE AS blocker_mode,b.LOCK_STATUS AS blocker_status,w.REQUESTING_ENGINE_TRANSACTION_ID AS waiter_trx,w.BLOCKING_ENGINE_TRANSACTION_ID AS blocker_trx,t.trx_query AS waiting_sql,bt.trx_query AS blocking_sql "
                +"FROM performance_schema.data_lock_waits w JOIN performance_schema.data_locks r ON r.ENGINE=w.ENGINE AND r.ENGINE_LOCK_ID=w.REQUESTING_ENGINE_LOCK_ID JOIN performance_schema.data_locks b ON b.ENGINE=w.ENGINE AND b.ENGINE_LOCK_ID=w.BLOCKING_ENGINE_LOCK_ID LEFT JOIN information_schema.innodb_trx t ON t.trx_id=w.REQUESTING_ENGINE_TRANSACTION_ID LEFT JOIN information_schema.innodb_trx bt ON bt.trx_id=w.BLOCKING_ENGINE_TRANSACTION_ID WHERE r.OBJECT_SCHEMA='hubble_draft_benchmark'";
        try(Statement st=observer.createStatement();ResultSet rs=st.executeQuery(sql)){
            while(rs.next()){
                var row=new LinkedHashMap<String,Object>();var meta=rs.getMetaData();
                for(int i=1;i<=meta.getColumnCount();i++)row.put(meta.getColumnLabel(i),rs.getObject(i));
                result.add(row);
            }
        }
        return result;
    }
    private Map<String,Object> run(Scenario s,int round,Connection observer,List<Map<String,Object>> raw,List<Map<String,Object>> snapshots)throws Exception{
        int count=96;
        var observations=new ConcurrentLinkedQueue<Map<String,Object>>();
        var captured=new ConcurrentLinkedQueue<Map<String,Object>>();
        var fixtures=new ArrayList<com.hubble.note.dto.response.NoteResponse>();
        for(int w=0;w<s.concurrency();w++){
            long actor=s.distinct()?(long)w+1:1L;
            var payload=new com.hubble.note.dto.request.NoteCreateRequest("fixture",body,Category.DEVELOPMENT,null,List.of("java","draft"),actor);
            fixtures.add(s.operation().equals("create")?null:publications.publish(actor,UUID.randomUUID().toString(),payload));
        }
        var before=counters(observer);
        var running=new AtomicBoolean(true);var monitor=newSingleMonitor();
        Future<?> poll=monitor.submit(()->{
            try{
                while(running.get()){
                    for(var row:lockSnapshot(observer)){row.put("scenario",s.name());row.put("round",round);captured.add(row);}
                    Thread.sleep(10);
                }
            }catch(Exception e){throw new RuntimeException(e);}
        });
        var pool=Executors.newFixedThreadPool(s.concurrency());var ready=new CountDownLatch(s.concurrency());var start=new CountDownLatch(1);var futures=new ArrayList<Future<?>>();
        for(int w=0;w<s.concurrency();w++){
            final int worker=w;
            futures.add(pool.submit(()->{
                var note=fixtures.get(worker);ready.countDown();
                try{start.await();}catch(InterruptedException e){Thread.currentThread().interrupt();throw new RuntimeException(e);}
                for(int i=worker;i<count;i+=s.concurrency()){
                    long actor=s.distinct()?(long)worker+1:1L;
                    var tags=s.operation().equals("update-tags")&&((i-worker)/s.concurrency())%2==0?List.of("java","spring"):List.of("java","draft");
                    var payload=new com.hubble.note.dto.request.NoteCreateRequest("measurement-"+seq.incrementAndGet(),body,Category.DEVELOPMENT,null,tags,actor,null,null,note==null?null:note.version());
                    var trace=new Trace();TRACE.set(trace);DraftSaveTiming.begin();long begin=System.nanoTime();String error=null;
                    boolean tagsMatch=false;
                    try{
                        note=s.operation().equals("create")?publications.publish(actor,UUID.randomUUID().toString(),payload):notes.updateNote(actor,note.id(),payload);
                        tagsMatch=new HashSet<>(note.tag()).equals(new HashSet<>(tags));
                    }catch(Exception e){error=e.getClass().getSimpleName();}
                    finally{
                        long total=System.nanoTime()-begin;var stages=DraftSaveTiming.end();TRACE.remove();
                        var row=new LinkedHashMap<String,Object>();row.put("scenario",s.name());row.put("round",round);row.put("worker",worker);row.put("request",i);row.put("totalNs",total);row.put("stagesNs",stages);row.put("jdbcNs",trace.timings);row.put("responseTagsMatch",tagsMatch);row.put("error",error);observations.add(row);
                    }
                }
            }));
        }
        ready.await();long begin=System.nanoTime();start.countDown();
        try{for(var f:futures)f.get(60,TimeUnit.SECONDS);}finally{pool.shutdownNow();running.set(false);try{poll.get(10,TimeUnit.SECONDS);}finally{monitor.shutdownNow();}}
        double seconds=(System.nanoTime()-begin)/1e9;
        var after=counters(observer);raw.addAll(observations);snapshots.addAll(captured);
        var summary=new LinkedHashMap<String,Object>();summary.put("scenario",s.name());summary.put("round",round);summary.put("requests",observations.size());summary.put("failures",(int)observations.stream().filter(r->r.get("error")!=null).count());summary.put("wallSeconds",seconds);summary.put("rowLockWaitMs",after.get("innodb_row_lock_time")-before.get("innodb_row_lock_time"));summary.put("rowLockWaits",after.get("innodb_row_lock_waits")-before.get("innodb_row_lock_waits"));summary.put("lockSnapshots",captured.size());
        assertThat(observations).hasSize(count);
        return summary;
    }
    private ExecutorService newSingleMonitor(){return Executors.newSingleThreadExecutor();}
    private record Scenario(String name,String operation,int concurrency,boolean distinct){}
}
