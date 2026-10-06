# Graph read-path benchmark (disposable Docker MySQL)

Measured on 2026-09-29 with MySQL 8.0.45 using `EXPLAIN ANALYZE` and the
scripts `graph-benchmark-setup.sql`, `graph-benchmark-rank.sql`, and
`graph-benchmark-compare.sql`. The isolated `graph_bench` schema contained
100,000 synthetic notes, 500,000 note-tag links, 12,987 distinct pair rows,
and 25,974 directed ranked-neighbor rows. `tag_0001` is deliberately common.

| Read stage | Plan observation | Observed server-side execution time |
| --- | --- | ---: |
| Original co-occurrence candidate query | 80,000 joined rows grouped into 999 candidates before `LIMIT 6` | 1,026–1,383 ms across the runs observed here |
| Initial ranked query with a join from `tags` | 999 ranked candidates sorted before `LIMIT 6` | about 1.3 ms |
| Revised ranked query with scalar source-ID lookup | ordered covering-index lookup stops after 6 rows; no sort | about 0.04–0.06 ms |

The first and last rows are **not identical end-to-end operations**: the first
produces co-occurrence candidates from source links, while the last reads
precomputed Jaccard scores. The comparison demonstrates the read work moved
out of the click path, not a production API latency improvement or a complete
cost reduction. Precomputation adds pair-building, event processing, storage,
and freshness costs. The numbers are single-machine synthetic `EXPLAIN
ANALYZE` observations, not load-test percentiles or a throughput guarantee.

The plan finding changed `GraphStatsStore.rankedNeighbors`: it now resolves
the source tag ID in a scalar subquery and lets MySQL read the ordered
`idx_graph_ranked_read` prefix. A join from `tags` caused MySQL to sort every
ranked neighbor before applying the result limit in this benchmark.

Before claiming production capacity, measure note-write latency, Kafka and
dirty-pair lag, high-degree tag refresh throughput, and graph API p95/p99 under
concurrent reads and writes on representative hardware and distributions.
