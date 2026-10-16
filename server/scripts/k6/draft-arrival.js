import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { Counter, Rate, Trend } from 'k6/metrics';

const fixtures = new SharedArray('drafts', () => JSON.parse(open('/inputs/fixtures.json')));
const attempted = new Counter('draft_attempted');
const succeeded = new Counter('draft_succeeded');
const failed = new Rate('draft_failed');
const verified = new Rate('draft_response_verified');
const duration = new Trend('draft_duration', true);
const versionConflict = new Counter('draft_conflicts');
const transportFailure = new Counter('draft_transport_failures');
const httpFailure = new Counter('draft_http_failures');
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
    draft_failed: ['rate<0.001'],
    draft_duration: ['p(95)<500'],
    draft_response_verified: ['rate>0.999'],
    dropped_iterations: ['count==0'],
  },
  summaryTrendStats: ['avg', 'med', 'p(95)', 'p(99)', 'max'],
};

export default function () {
  if (!current) current = { ...fixtures[__VU - 1] };
  const title = `k6-${__ENV.RUN_LABEL}-${__VU}-${++sequence}`;
  const payload = {
    id: current.id, version: current.version, noteId: current.noteId,
    baseNoteVersion: current.baseNoteVersion, title,
    content: '<p>' + 'draft measurement content '.repeat(160) + '</p>',
    category: 'DEVELOPMENT', storyId: current.storyId,
    tags: ['java', 'draft'], imageUrl: null,
  };
  attempted.add(1);
  const response = http.post(`${__ENV.BASE_URL}/api/draft`, JSON.stringify(payload), {
    headers: { Authorization: `Bearer ${current.token}`, 'Content-Type': 'application/json' },
    timeout: '10s', tags: { name: 'POST /api/draft' },
  });
  duration.add(response.timings.duration);
  let ok = false;
  if (response.status === 200) {
    try {
      const saved = response.json();
      ok = saved.id === current.id && saved.title === title && saved.content === payload.content
        && saved.noteId === current.noteId && saved.version === current.version + 1;
      if (ok) current.version = saved.version;
    } catch (_) { /* Count malformed responses as failures. */ }
  }
  if (ok) succeeded.add(1);
  else if (response.status === 409) versionConflict.add(1);
  else if (response.status === 0) transportFailure.add(1);
  else if (response.status !== 200) httpFailure.add(1);
  failed.add(!ok);
  verified.add(ok);
}

export function handleSummary(data) {
  data.benchmark = { profile: __ENV.PROFILE, rate, seconds, run: __ENV.RUN_LABEL };
  return { [`/results/${__ENV.RUN_LABEL}.json`]: JSON.stringify(data, null, 2) };
}
