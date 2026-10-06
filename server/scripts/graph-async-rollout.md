# Graph asynchronous pipeline rollout

The API contract and graph UI stay unchanged. `GRAPH_ASYNC_ENABLED=false` is the
default: note writes update the existing counters synchronously and clicks use
the previous exact, paged ranking path. Enabling the switch changes both paths:
note writes persist an outbox event in the note transaction; Kafka consumers
update counts and enqueue affected pairs; rank workers update the directed,
indexed read model; clicks read that model without computing Jaccard.

## Controlled cutover

1. Back up the database. Pause note create/update/delete traffic and stop old
   API instances. Do not enable the new mode while an old writer remains.
2. Start the API once with `GRAPH_ASYNC_ENABLED=false` so Flyway applies V3 and
   V4. Verify `flyway_schema_history` and the V4 tables. An existing database
   also needs the original `graph-stats-backfill.sql` to have completed.
3. Run `graph-stats-verify.sql`. All four mismatch counts must be zero. If they
   are not, repair source/counters before proceeding.
4. With writes still paused, run `graph-rank-backfill.sql`, followed by
   `graph-rank-verify.sql`. All four rank checks must be zero. This is a
   controlled initial build, not an online periodic full rebuild.
5. Start Kafka and the new API with `GRAPH_ASYNC_ENABLED=true` and
   `GRAPH_WORKER_ENABLED=false`. Start at least one separate graph-worker
   process with both flags true (the Compose `graph-async` profile provides a
   development example). Confirm the
   `graph-note-changes` and `graph-note-changes.DLT` topics exist. Resume writes.
6. Create, edit, recategorize, and delete a test note. Wait for the outbox and
   dirty-pair backlogs to drain, then rerun both verification scripts and check
   the graph response. Compare note-write latency and graph-click latency with
   the previous path under representative large data.

For the existing local `hubble` MySQL, `scripts/graph-local-flyway.sh` starts
the API on port 18080 with asynchronous mode **off** and prompts for the JDBC
password without echoing it. It is only the schema-migration step: after the
`Started ServerApplication` message, stop it with Ctrl-C before running the
rank backfill. Do not run the backfill while note writes are active. The local
MySQL login path can then run `graph-rank-backfill.sql` and both verification
scripts without exposing a password in the command line. The async mode must
not be enabled until the ranked data, Kafka, API, and worker are all ready.

For a local two-process smoke test, start the development Kafka broker and
run `bash scripts/graph-local-async.sh`. It prompts once for the local JDBC
password, starts the worker before the API, and monitors both. The API listens
on port 8080, while the worker has no web listener. Ctrl+C stops both; the
Kafka container remains running. The script logs to a private temporary
directory. This is a development-only process launcher, not a production
service supervisor.

The Docker Compose Kafka service is a **single-node development broker**, not
the production topology. Production needs independently operated brokers,
appropriate replication, retention, alerting, and capacity limits. The topic
partition and replication settings are `graph.kafka.partitions` and
`graph.kafka.replicas`.

## Disposable integration verification

`GraphAsyncIntegrationTest` is opt-in because it writes real notes and requires
both MySQL and Kafka. Run it only against an isolated, disposable database by
setting `GRAPH_INTEGRATION_ENABLED=true`, the `SPRING_DATASOURCE_*` variables,
and `SPRING_KAFKA_BOOTSTRAP_SERVERS`; never point it at the user's normal DB.
The test creates, edits, and deletes notes, then waits for the outbox, consumer,
and rank worker to converge. Afterward run both verification SQL scripts.

The initial migration/backfill was exercised on a restored copy of the local
database, not the live local database. That copy had 60 notes and 139 note-tag
links; all four statistics checks and all four ranking checks returned zero
mismatches. The separate 100k-note read-path experiment and its limitations
are recorded in `graph-async-benchmark-results.md`.

## Correctness and failure handling

- The outbox row commits with the note. Sending to Kafka happens afterward.
  A crash after Kafka acknowledges but before marking the row published can
  send the event again. `graph_processed_events` prevents double application;
  the processed key and counter changes commit in the same MySQL transaction.
- Outbox events for one note are published in sequence order and Kafka uses
  `note_id` as its record key. If processing fails repeatedly, the original
  record goes to `graph-note-changes.DLT`; it must be investigated and replayed.
  A nonempty DLT means graph counts can be stale or wrong.
- Score refreshes are coalesced by `(category, tag_a_id, tag_b_id)` and process
  only pairs incident to a tag whose usage changed. The read model may lag the
  source while the event or score queue is pending.
- Do **not** simply flip the switch back to false after async writes have
  occurred. First pause writes, drain/replay events, verify or rebuild the
  counters from source, and only then switch the read/write mode together.

## Operational checks

```sql
SELECT COUNT(*) AS unpublished_events,
       TIMESTAMPDIFF(SECOND, MIN(created_at), NOW(6)) AS oldest_age_seconds
FROM graph_note_outbox WHERE published_at IS NULL;

SELECT COUNT(*) AS dirty_pairs,
       TIMESTAMPDIFF(SECOND, MIN(requested_at), NOW(6)) AS oldest_age_seconds
FROM graph_rank_dirty_pairs;
```

Watch Kafka consumer lag and DLT depth alongside these counts. Outbox and
processed-event retention need an explicit replay horizon before cleanup; do
not delete deduplication records merely because they are old. A high-degree tag
still causes many affected pair scores to change, so the workload must be
capacity-tested before claiming a latency or freshness target.
