#!/usr/bin/env python3
"""Disposable local Docker environment only; fixed-rate real HTTP draft saves."""
import concurrent.futures, json, pathlib, subprocess, time, urllib.request, hashlib, statistics
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT.parent / 'outputs' / 'draft-k6-baseline'
INPUT = ROOT / 'api' / 'build' / 'draft-k6-inputs'
API = 'http://127.0.0.1:18080'
DB = 'hubble-draft-k6-db'
APP = 'hubble-draft-k6-api'
NET = 'hubble-draft-k6-net'
N = 100
PASSWORD = 'draft-test-password'

def command(args, **kwargs):
    return subprocess.run(args, check=True, text=True, **kwargs)

def sql(query):
    return command(['docker', 'exec', '-i', DB, 'mysql', '-uroot', '-pdraft-k6-local-test', '-N', '-B', 'hubble_draft_k6'], input=query, capture_output=True).stdout

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
    fixtures = []
    for fixture in PROFILES[profile]:
        saved = request('/api/draft/'+str(fixture['id']), token=fixture['token'])
        fixtures.append({**fixture, 'version': saved['version']})
    (INPUT / 'fixtures.json').write_text(json.dumps(fixtures))
    return sum(f['version'] for f in fixtures)

def run(profile, rate, seconds, label):
    before_version = versions(profile)
    before_lock = state()
    # Unique input/read-only mount per invocation, summaries contain no auth tokens.
    args = ['docker','run','--rm','--name','hubble-draft-k6-load','--network',NET,'--cpus','1','--memory','512m',
            '--user','0','-v',str(ROOT/'scripts'/'k6')+':/scripts:ro','-v',str(INPUT)+':/inputs:ro','-v',str(OUT)+':/results',
            '-e','BASE_URL=http://'+APP+':8080','-e','PROFILE='+profile,'-e','RATE='+str(rate),'-e','SECONDS='+str(seconds),'-e','RUN_LABEL='+label,
            'grafana/k6:latest','run','--quiet','/scripts/draft-arrival.js']
    with (OUT/(label+'.log')).open('w') as log:
        result = subprocess.run(args, stdout=log, stderr=subprocess.STDOUT, text=True)
    if result.returncode not in (0,99):
        raise RuntimeError('k6 runtime failed: '+label+'; see log')
    after_lock = state()
    ids = ','.join(str(f['id']) for f in PROFILES[profile])
    after_version = int(sql('SELECT SUM(version) FROM drafts WHERE id IN ('+ids+');').strip())
    summary = json.loads((OUT/(label+'.json')).read_text())
    metrics = summary['metrics']
    def count(metric): return metrics.get(metric,{}).get('values',{}).get('count',0)
    row = {'profile':profile,'rate':rate,'seconds':seconds,'label':label,'k6Exit':result.returncode,
           'planned':rate*seconds,'attempted':int(count('draft_attempted')),'succeeded':int(count('draft_succeeded')),
           'dropped':int(count('dropped_iterations')),'failRate':metrics['draft_failed']['values']['rate'],
           'avgMs':metrics['draft_duration']['values']['avg'],'p95Ms':metrics['draft_duration']['values']['p(95)'],
           'p99Ms':metrics['draft_duration']['values']['p(99)'],'versionIncrements':after_version-before_version,
           'rowLockWaitMs':after_lock['Innodb_row_lock_time']-before_lock['Innodb_row_lock_time'],
           'rowLockWaits':after_lock['Innodb_row_lock_waits']-before_lock['Innodb_row_lock_waits']}
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
    assert sql('SELECT DATABASE();').strip() == 'hubble_draft_k6'
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
    PROFILES = {'distributed':[], 'shared-story':[]}
    for profile in PROFILES:
        def make_draft(slot):
            uid = slot if profile=='distributed' else 1
            payload={'title':'fixture','content':'<p>fixture</p>','category':'DEVELOPMENT','tags':['java','draft'],
                     'noteId':uid,'baseNoteVersion':0,'storyId':uid}
            saved=request('/api/draft',payload,tokens[uid])
            return {'id':saved['id'],'version':saved['version'],'noteId':uid,'baseNoteVersion':0,'storyId':uid,'token':tokens[uid]}
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            PROFILES[profile] = list(pool.map(make_draft,range(1,N+1)))
    metadata = {'scope':'Actual JWT-authenticated HTTP POST /api/draft; edit draft resaves with changing title and ~4KB fixed body',
                'apiCpuLimit':2,'apiMemoryMiB':768,'jvmHeapMiB':512,'dbCpuLimit':2,'dbMemoryMiB':1536,
                'k6CpuLimit':1,'k6MemoryMiB':512,'preallocatedVUs':100,'maxVUs':100,
                'profiles':{'distributed':'100 users each with their own story/note/draft','shared-story':'1 user/story/note; 100 distinct drafts'},
                'thresholds':'Exploratory: p95<500ms, failure rate<0.1%, dropped iterations=0',
                'jarSha256':hashlib.sha256(next((ROOT/'api'/'build'/'libs').glob('*SNAPSHOT.jar')).read_bytes()).hexdigest(),
                'images':{image:json.loads(command(['docker','image','inspect',image,'--format','{{json .RepoDigests}}'],capture_output=True).stdout) for image in ['mysql:8.0','eclipse-temurin:17-jre','grafana/k6:latest']},
                'dockerInfo':json.loads(command(['docker','info','--format','{"cpus":{{.NCPU}},"memoryBytes":{{.MemTotal}},"version":"{{.ServerVersion}}","arch":"{{.Architecture}}"}'],capture_output=True).stdout)}
    (OUT/'environment.json').write_text(json.dumps(metadata,indent=2))
    for profile in PROFILES: run(profile,10,10,'warmup-'+profile)
    results=[]
    for index,rate in enumerate([10,30,60,100]):
        order=['distributed','shared-story'] if index%2==0 else ['shared-story','distributed']
        for profile in order:
            results.append(run(profile,rate,30,f'{profile}-{rate}'))
    # Verify no extra drafts/notes were created by resaves.
    cardinality={'drafts':int(sql('SELECT COUNT(*) FROM drafts;').strip()),'notes':int(sql('SELECT COUNT(*) FROM notes;').strip())}
    (OUT/'results.json').write_text(json.dumps({'results':results,'cardinality':cardinality},indent=2))
    print('benchmark complete',json.dumps(cardinality),flush=True)
finally:
    if (INPUT/'fixtures.json').exists(): (INPUT/'fixtures.json').unlink()
