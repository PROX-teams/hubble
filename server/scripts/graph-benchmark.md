# Graph co-occurrence query benchmark

Use a **disposable MySQL instance**, never the application database. The setup
script creates its own `graph_bench` schema with 100,000 synthetic notes, 1,000
tags, and 500,000 note-tag rows. `tag_0001` is deliberately common.

From the repository root, set `BENCH_SOCKET` to the disposable instance's socket:

```sh
mysql --socket="$BENCH_SOCKET" -u root < server/scripts/graph-benchmark-setup.sql
mysql --socket="$BENCH_SOCKET" -u root -D graph_bench -e 'ANALYZE TABLE notes, note_tags, tags'
mysqlslap --socket="$BENCH_SOCKET" -u root --create-schema=graph_bench --query=server/scripts/graph-benchmark-query.sql --number-of-queries=5 --iterations=5 --concurrency=1 --no-drop
mysql --socket="$BENCH_SOCKET" -u root < server/scripts/graph-benchmark-index.sql
mysqlslap --socket="$BENCH_SOCKET" -u root --create-schema=graph_bench --query=server/scripts/graph-benchmark-query.sql --number-of-queries=5 --iterations=5 --concurrency=1 --no-drop
```

On 2026-09-23, with MySQL 9.2.0 on a local Mac, the five-iteration average
for five queries was 4.540 seconds before and 1.305 seconds after adding the
two composite lookup indexes: about **908 ms vs 261 ms per query**, a 71%
reduction. That benchmark measured lookup performance; it did not isolate the
effect of making `(note_id, tag_id)` unique. The unique index now provides the
same lookup path plus database-level duplicate protection.
The measured query is the co-occurrence lookup used by graph expansion, not
the complete HTTP request. The execution plan changed from scanning 70,000
category notes before filtering the center tag to looking up the 20,000 center
tag associations first via `(tag_id, note_id)` and traversing neighbors via
`(note_id, tag_id)`. Actual time and query plan will vary by data distribution,
MySQL version, and hardware. Re-run the benchmark before making a broader
performance claim.

The application declares these indexes in `NoteTag`. Its current local
`spring.jpa.hibernate.ddl-auto=update` configuration will add them on startup;
other environments need a schema migration before they can use the improvement.
