#!/usr/bin/env python3
"""Disposable local Docker environment only; fixed-rate real HTTP draft saves."""
import concurrent.futures, json, pathlib, subprocess, time, urllib.request, hashlib, statistics, os
ROOT = pathlib.Path(__file__).resolve().parents[2]
VARIANT = os.environ.get('NOTE_WRITE_VARIANT','before')
OUT = ROOT.parent / 'outputs' / 'note-k6-comparison' / VARIANT
INPUT = ROOT / 'api' / 'build' / 'draft-k6-inputs'
API = 'http://127.0.0.1:18080'
DB = 'hubble-note-k6-db'
APP = 'hubble-note-k6-api'
NET = 'hubble-note-k6-net'
N = 100
PASSWORD = 'draft-test-password'

def command(args, **kwargs):
    return subprocess.run(args, check=True, text=True, **kwargs)

def sql(query):
    return command(['docker', 'exec', '-i', DB, 'mysql', '-uroot', '-pdraft-k6-local-test', '-N', '-B', 'hubble_note_k6'], input=query, capture_output=True).stdout

def request(path, payload=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token: headers['Authorization'] = 'Bearer ' + token
    req = urllib.request.Request(API+path, data=json.dumps(payload).encode() if payload is not None else None, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)

def state():
    rows = sql("SHOW GLOBAL STATUS WHERE Variable_name IN ('Innodb_row_lock_time','Innodb_row_lock_waits');")
    return {k: int(v) for k,v in (line.split('\t') for line in rows.splitlines())}

def versions(profile):
    rows = sql('SELECT id,content_version FROM notes WHERE id<=200;')
    current = {int(k):int(v) for k,v in (line.split('\t') for line in rows.splitlines())}
    fixtures = [{**f, 'version':current[f['id']]} for f in PROFILES[profile]]
    (INPUT / 'fixtures.json').write_text(json.dumps(fixtures))
    return sum(current[f['id']] for f in PROFILES[profile])

def reset_fixture():
    sql("DELETE FROM publication_requests; DELETE FROM graph_note_outbox; DELETE FROM note_tags; DELETE FROM notes WHERE id>200; UPDATE notes SET content_version=0,title='fixture',content='<p>fixture</p>',category='DEVELOPMENT'; INSERT INTO note_tags(note_id,tag_id) SELECT id,1 FROM notes; INSERT INTO note_tags(note_id,tag_id) SELECT id,2 FROM notes;")

def run(operation, profile, rate, seconds, label):
    reset_fixture()
    before_version = versions(profile)
    before_lock = state()
    # Unique input/read-only mount per invocation, summaries contain no auth tokens.
    args = ['docker','run','--rm','--name','hubble-note-k6-load','--network',NET,'--cpus','1','--memory','512m',
            '--user','0','-v',str(ROOT/'scripts'/'k6')+':/scripts:ro','-v',str(INPUT)+':/inputs:ro','-v',str(OUT)+':/results',
            '-e','BASE_URL=http://'+APP+':8080','-e','PROFILE='+profile,'-e','RATE='+str(rate),'-e','SECONDS='+str(seconds),'-e','RUN_LABEL='+label,'-e','OPERATION='+operation,
            'grafana/k6:latest','run','--quiet','/scripts/note-arrival.js']
    with (OUT/(label+'.log')).open('w') as log:
        result = subprocess.run(args, stdout=log, stderr=subprocess.STDOUT, text=True)
    if result.returncode not in (0,99):
        raise RuntimeError('k6 runtime failed: '+label+'; see log')
    after_lock = state()
    ids = ','.join(str(f['id']) for f in PROFILES[profile])
    after_version = int(sql('SELECT SUM(content_version) FROM notes WHERE id IN ('+ids+');').strip())
    summary = json.loads((OUT/(label+'.json')).read_text())
    metrics = summary['metrics']
    def count(metric): return metrics.get(metric,{}).get('values',{}).get('count',0)
    row = {'operation':operation,'variant':VARIANT,'profile':profile,'rate':rate,'seconds':seconds,'label':label,'k6Exit':result.returncode,
           'planned':rate*seconds,'attempted':int(count('write_attempted')),'succeeded':int(count('write_succeeded')),
           'dropped':int(count('dropped_iterations')),'failRate':metrics['write_failed']['values']['rate'],
           'avgMs':metrics['write_duration']['values']['avg'],'p95Ms':metrics['write_duration']['values']['p(95)'],
           'p99Ms':metrics['write_duration']['values']['p(99)'],'versionIncrements':after_version-before_version,
           'rowLockWaitMs':after_lock['Innodb_row_lock_time']-before_lock['Innodb_row_lock_time'],
           'rowLockWaits':after_lock['Innodb_row_lock_waits']-before_lock['Innodb_row_lock_waits'],
           'tagsResponseMatchRate':metrics['write_tags_verified']['values']['rate'],
           'noteCount':int(sql('SELECT COUNT(*) FROM notes;').strip()),
           'outboxCount':int(sql('SELECT COUNT(*) FROM graph_note_outbox;').strip()),
           'publicationCount':int(sql('SELECT COUNT(*) FROM publication_requests;').strip()),
           'tagLinkCount':int(sql('SELECT COUNT(*) FROM note_tags;').strip())}
    (OUT/(label+'-db.json')).write_text(json.dumps(row,indent=2))
    print(json.dumps(row),flush=True)
    time.sleep(3)
    return row

OUT.mkdir(parents=True,exist_ok=True)
try:
    deadline = time.monotonic()+120
    while True:
        try:
            request('/v3/api-docs'); break
        except Exception:
            if time.monotonic()>deadline: raise
            time.sleep(1)
    assert sql('SELECT DATABASE();').strip() == 'hubble_note_k6'
    hashed = (INPUT/'password-hash.txt').read_text().strip()
    assert hashed.startswith('$2') and "'" not in hashed
    inserts = []
    for uid in range(1,N+1):
        inserts.append(f"INSERT INTO users(id,created_at,updated_at,email,password,nickname,provider_type) VALUES({uid},NOW(6),NOW(6),'k6{uid}@test.local','{hashed}','k6user{uid}','EMAIL');")
        inserts.append(f"INSERT INTO stories(id,created_at,updated_at,title,description,user_id,category,view_count,like_count,bookmark_count) VALUES({uid},NOW(6),NOW(6),'k6 story','fixture',{uid},'DEVELOPMENT',0,0,0);")
        inserts.append(f"INSERT INTO notes(id,created_at,updated_at,title,content,story_id,user_id,category,view_count,like_count,bookmark_count,popularity_score) VALUES({uid},NOW(6),NOW(6),'original','original',{uid},{uid},'DEVELOPMENT',0,0,0,0);")
    sql('\n'.join(inserts))
    def login(uid):
        return uid, request('/api/auth/login',{'email':f'k6{uid}@test.local','password':PASSWORD})['accessToken']
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        tokens = dict(pool.map(login,range(1,N+1)))
    sql("INSERT INTO tags(id,name) VALUES(1,'java'),(2,'draft'),(3,'spring');")
    for ident in range(101,201):
        sql(f"INSERT INTO notes(id,created_at,updated_at,title,content,story_id,user_id,category,view_count,like_count,bookmark_count,popularity_score) VALUES({ident},NOW(6),NOW(6),'fixture','fixture',1,1,'DEVELOPMENT',0,0,0,0);")
    PROFILES = {
        'distributed':[{'id':uid,'userId':uid,'storyId':uid,'token':tokens[uid]} for uid in range(1,N+1)],
        'shared-story':[{'id':100+slot,'userId':1,'storyId':1,'token':tokens[1]} for slot in range(1,N+1)]
    }
    metadata = {'scope':'Actual JWT-authenticated POST/PUT /api/note; create, body-only update, tag-changing update; no optional drafts in load; separate correctness tests cover draft-linked publication',
                'apiCpuLimit':2,'apiMemoryMiB':768,'jvmHeapMiB':512,'dbCpuLimit':2,'dbMemoryMiB':1536,
                'k6CpuLimit':1,'k6MemoryMiB':512,'preallocatedVUs':100,'maxVUs':100,
                'profiles':{'distributed':'100 available users/story/note fixtures; each active VU owns its note','shared-story':'1 user/story, 100 distinct note fixtures; active VUs own distinct notes'},
                'thresholds':'Exploratory: p95<500ms, failure rate<0.1%, dropped iterations=0',
                'jarSha256':hashlib.sha256(pathlib.Path(os.environ.get('BENCH_JAR',str(next((ROOT/'api'/'build'/'libs').glob('*SNAPSHOT.jar'))))).read_bytes()).hexdigest(),
                'images':{image:json.loads(command(['docker','image','inspect',image,'--format','{{json .RepoDigests}}'],capture_output=True).stdout) for image in ['mysql:8.0','eclipse-temurin:17-jre','grafana/k6:latest']},
                'dockerInfo':json.loads(command(['docker','info','--format','{"cpus":{{.NCPU}},"memoryBytes":{{.MemTotal}},"version":"{{.ServerVersion}}","arch":"{{.Architecture}}"}'],capture_output=True).stdout)}
    (OUT/'environment.json').write_text(json.dumps(metadata,indent=2))
    for operation in ['create','update-body','update-tags']:
        for profile in PROFILES:
            run(operation,profile,30,10,'warmup-'+operation+'-'+profile)
    results=[]
    for round_no in range(1,3):
        for rate in [30,100]:
            cases=[(op,p) for op in ['create','update-body','update-tags'] for p in PROFILES]
            import random
            random.Random(20260+round_no*10+rate).shuffle(cases)
            for operation,profile in cases:
                results.append(run(operation,profile,rate,20,f'{operation}-{profile}-{rate}-r{round_no}'))
                (OUT/'results.json').write_text(json.dumps({'results':results},indent=2))
    print('note benchmark complete',VARIANT,flush=True)
finally:
    if (INPUT/'fixtures.json').exists(): (INPUT/'fixtures.json').unlink()
