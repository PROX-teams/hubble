# Graph statistics rollout

The API now reads precomputed tag-pair and usage counts for graph expansion. The schema and backfill are required before starting this API version; an empty derived table would produce empty neighbors.

1. Pause note create/update/delete requests, and stop any API instance that can still write notes. Take a recoverable database backup.
2. Apply the Flyway migrations before serving requests. `V1__baseline_schema.sql` is the schema snapshot for a fresh DB; an existing nonempty DB is baselined at version 1. `V2__graph_tag_statistics.sql` creates the summary tables. The old `graph-stats-schema.sql` is only a manual recovery copy.
3. Run `graph-stats-backfill.sql`, then `graph-stats-verify.sql` while writes remain paused. All four mismatch counts must be zero. If not, investigate before serving requests.
4. Start/resume the updated API. Do not run the backfill while note writes are enabled.

For the local `hubble` database, schema creation and backfill were applied on 2026-09-29 and verified against 60 active notes and 139 note-tag rows (all four mismatch counts were zero). Flyway history itself is not yet created until the updated application starts with valid JDBC credentials.

Each note write updates the source rows and derived counters in one transaction. A failed counter update rolls back the note write. The pair table stores each unordered pair once, with smaller tag ID first. Zero-count rows are retained to avoid delete/reinsert races and are excluded from graph reads.

This first version reads popular seeds from the usage summary, but still aggregates recent (30-day) tags from source data. It computes Jaccard/order in the API from precomputed counts. Its read cost still grows with the number of distinct neighbors of a very high-degree tag; a directed ranked-neighbor read model can be added separately if that becomes the limiting stage.

The optional asynchronous write/ranked-read pipeline is now described in
`graph-async-rollout.md`. The paragraph above describes the default
`GRAPH_ASYNC_ENABLED=false` mode only. Do not turn on the asynchronous mode
without the V4 migration, ranked-neighbor backfill, Kafka, and verification.
