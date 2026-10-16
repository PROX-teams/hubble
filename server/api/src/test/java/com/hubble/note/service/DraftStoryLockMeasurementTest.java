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
@EnabledIfEnvironmentVariable(named="DRAFT_LOCK_MEASURE", matches="true")
@Import(DraftStoryLockMeasurementTest.Probes.class)
@SpringBootTest(properties={
    "bench.draft.probes=true",
    "spring.datasource.url=jdbc:mysql://127.0.0.1:13326/hubble_draft_benchmark?serverTimezone=UTC&characterEncoding=UTF-8",
    "spring.datasource.username=root", "spring.datasource.password=draft-local-test",
    "spring.jpa.show-sql=false", "spring.jpa.properties.hibernate.format_sql=false",
    "graph.worker.enabled=false", "spring.kafka.listener.auto-startup=false"
})
class DraftStoryLockMeasurementTest {
    @Autowired DraftService service;
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
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name="bench.draft.probes", havingValue="true")
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
                    if(lower.contains("from stories")&&(lower.contains("for update")||lower.contains("for share")||lower.contains("lock in share mode")))return statement((PreparedStatement)result,sql);
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
                        long end=System.nanoTime();trace.add("storySqlExecuteNs",end-start);trace.sql=sql;trace.storyQueryReturned=end;
                    }
                }
            });
        }
    }
    @Test void locateStoryDelay() throws Exception {
        assertThat(jdbc.queryForObject("SELECT DATABASE()",String.class)).isEqualTo("hubble_draft_benchmark");
        jdbc.update("DELETE FROM drafts");jdbc.update("DELETE FROM notes");jdbc.update("DELETE FROM stories");jdbc.update("DELETE FROM users");
        jdbc.update("INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) VALUES(1,NOW(6),NOW(6),'draft@test.local','test-only','draft','EMAIL')");
        for(int i=1;i<=8;i++)jdbc.update("INSERT INTO stories(id,created_at,updated_at,title,description,user_id,category,view_count,like_count,bookmark_count) VALUES(?,NOW(6),NOW(6),'measure','measure',1,'DEVELOPMENT',0,0,0)",i);
        jdbc.update("INSERT INTO notes(id,created_at,updated_at,title,content,story_id,user_id,category,view_count,like_count,bookmark_count,popularity_score) VALUES(1,NOW(6),NOW(6),'original','original',1,1,'DEVELOPMENT',0,0,0,0)");
        long baseVersion=jdbc.queryForObject("SELECT content_version FROM notes WHERE id=1",Long.class);
        List<Scenario> scenarios=List.of(new Scenario("shared-story-sequential",1,false,false),new Scenario("shared-story-concurrent",8,false,false),new Scenario("distinct-stories-concurrent",8,true,false),new Scenario("no-story-concurrent",8,false,true));
        for(Scenario s:scenarios){
            DraftResponse draft=null;
            for(int i=0;i<50;i++)draft=service.saveDraft(1L,request(draft,s.noStory()?null:1L,baseVersion));
        }
        List<Map<String,Object>> summaries=new ArrayList<>(),raw=new ArrayList<>(),locks=new ArrayList<>();
        try(Connection observer=DriverManager.getConnection(URL,"root","draft-local-test")){
            for(int round=1;round<=3;round++){
                var order=new ArrayList<>(scenarios);Collections.shuffle(order,new Random(8200L+round));
                for(Scenario s:order)summaries.add(run(s,round,baseVersion,observer,raw,locks));
            }
        }
        var report=new LinkedHashMap<String,Object>();
        report.put("scope","Existing-post edit draft resaves; original service flow, JDBC execution probes and separate performance_schema lock polling");
        report.put("requestsPerRound",240);report.put("bodyUtf8Bytes",body.getBytes(java.nio.charset.StandardCharsets.UTF_8).length);
        report.put("lockWaitMeaning","InnoDB global row lock counters measured before/after each batch on the dedicated DB; not per-request story-only timers");
        report.put("summaries",summaries);report.put("requests",raw);report.put("lockSnapshots",locks);
        Path file=Path.of("build/reports/draft-story-lock-measurement/results.json");Files.createDirectories(file.getParent());json.writerWithDefaultPrettyPrinter().writeValue(file.toFile(),report);
        assertThat(summaries).allSatisfy(row->assertThat(row.get("failures")).isEqualTo(0));
    }
    private DraftSaveRequest request(DraftResponse draft,Long story,long baseVersion){
        return new DraftSaveRequest(draft==null?null:draft.id(),1L,baseVersion,"measurement-"+seq.incrementAndGet(),body,Category.DEVELOPMENT,story,List.of("java","draft"),null,draft==null?null:draft.version());
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
    private Map<String,Object> run(Scenario s,int round,long baseVersion,Connection observer,List<Map<String,Object>> raw,List<Map<String,Object>> snapshots)throws Exception{
        int count=240;
        var observations=new ConcurrentLinkedQueue<Map<String,Object>>();
        var captured=new ConcurrentLinkedQueue<Map<String,Object>>();
        var fixtures=new ArrayList<DraftResponse>();
        for(int w=0;w<s.concurrency();w++)fixtures.add(service.saveDraft(1L,request(null,s.noStory()?null:s.distinct()?(long)w+1:1L,baseVersion)));
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
                DraftResponse draft=fixtures.get(worker);ready.countDown();
                try{start.await();}catch(InterruptedException e){Thread.currentThread().interrupt();throw new RuntimeException(e);}
                for(int i=worker;i<count;i+=s.concurrency()){
                    var payload=request(draft,s.noStory()?null:s.distinct()?(long)worker+1:1L,baseVersion);
                    var trace=new Trace();TRACE.set(trace);DraftSaveTiming.begin();long begin=System.nanoTime();String error=null;
                    try{draft=service.saveDraft(1L,payload);}catch(Exception e){error=e.getClass().getSimpleName();}
                    finally{
                        long total=System.nanoTime()-begin;var stages=DraftSaveTiming.end();TRACE.remove();
                        var row=new LinkedHashMap<String,Object>();row.put("scenario",s.name());row.put("round",round);row.put("worker",worker);row.put("request",i);row.put("totalNs",total);row.put("stagesNs",stages);row.put("jdbcNs",trace.timings);row.put("storySql",trace.sql);row.put("error",error);observations.add(row);
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
        if(!s.noStory())assertThat(observations).allSatisfy(row->assertThat(((Map<?,?>)row.get("jdbcNs")).containsKey("storySqlExecuteNs")).isTrue());
        return summary;
    }
    private ExecutorService newSingleMonitor(){return Executors.newSingleThreadExecutor();}
    private record Scenario(String name,int concurrency,boolean distinct,boolean noStory){}
}
