import http from 'k6/http';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { Counter, Rate, Trend } from 'k6/metrics';

const fixtures = new SharedArray('drafts', () => JSON.parse(open('/inputs/fixtures.json')));
const operation = __ENV.OPERATION;
const attempted = new Counter('write_attempted');
const succeeded = new Counter('write_succeeded');
const failed = new Rate('write_failed');
const verified = new Rate('write_response_verified');
const duration = new Trend('write_duration', true);
const tagVerified = new Rate('write_tags_verified');
const versionConflict = new Counter('write_conflicts');
const transportFailure = new Counter('write_transport_failures');
const httpFailure = new Counter('write_http_failures');
let current;
let sequence = 0;
const rate = Number(__ENV.RATE);
const seconds = Number(__ENV.SECONDS || 30);

export const options = {
  scenarios: {
    save: {
      executor: 'constant-arrival-rate', rate, timeUnit: '1s',
      duration: `${seconds}s`, preAllocatedVUs: 100, maxVUs: 100,
      gracefulStop: '30s',
    },
  },
  thresholds: {
    write_failed: ['rate<0.001'],
    write_duration: ['p(95)<500'],
    write_response_verified: ['rate>0.999'],
    dropped_iterations: ['count==0'],
  },
  summaryTrendStats: ['avg', 'med', 'p(95)', 'p(99)', 'max'],
};

export default function () {
  if (!current) current = { ...fixtures[__VU - 1] };
  const title = `k6-${__ENV.RUN_LABEL}-${__VU}-${++sequence}`;
  const tags = operation === 'update-tags' && sequence % 2 === 1 ? ['java', 'spring'] : ['java', 'draft'];
  const payload = {
    noteVersion: operation === 'create' ? undefined : current.version,
    title, content: '<p>' + 'draft measurement content '.repeat(160) + '</p>',
    category: 'DEVELOPMENT', storyId: current.storyId,
    tag: tags, imageUrl: null,
  };
  const headers = { Authorization: `Bearer ${current.token}`, 'Content-Type': 'application/json' };
  if (operation === 'create') headers['Idempotency-Key'] = `${__ENV.RUN_LABEL}-${exec.scenario.iterationInTest}`;
  attempted.add(1);
  const endpoint = operation === 'create' ? '/api/note' : `/api/note/${current.id}`;
  const response = http.request(operation === 'create' ? 'POST' : 'PUT', `${__ENV.BASE_URL}${endpoint}`, JSON.stringify(payload), {
    headers, timeout: '10s', tags: { name: operation === 'create' ? 'POST /api/note' : 'PUT /api/note/:id' },
  });
  duration.add(response.timings.duration);
  let ok = false;
  let tagsOk = false;
  if (response.status === (operation === 'create' ? 201 : 200)) {
    try {
      const saved = response.json();
      ok = saved.title === title && saved.description === payload.content && saved.storyId === current.storyId
        && saved.authorId === current.userId && (operation === 'create' ? saved.version === 0 : saved.id === current.id && saved.version === current.version + 1);
      tagsOk = JSON.stringify((saved.tag || []).slice().sort()) === JSON.stringify(tags.slice().sort());
      if (ok && operation !== 'create') current.version = saved.version;
    } catch (_) { /* Count malformed responses as failures. */ }
  }
  if (ok) succeeded.add(1);
  else if (response.status === 409) versionConflict.add(1);
  else if (response.status === 0) transportFailure.add(1);
  else if (response.status !== 200) httpFailure.add(1);
  tagVerified.add(tagsOk);
  failed.add(!ok);
  verified.add(ok);
}

export function handleSummary(data) {
  data.benchmark = { operation, profile: __ENV.PROFILE, rate, seconds, run: __ENV.RUN_LABEL };
  return { [`/results/${__ENV.RUN_LABEL}.json`]: JSON.stringify(data, null, 2) };
}
