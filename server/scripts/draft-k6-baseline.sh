#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bench_network='hubble-draft-k6-net'
bench_db='hubble-draft-k6-db'
bench_app='hubble-draft-k6-api'
for name in "$bench_db" "$bench_app" 'hubble-draft-k6-load'; do
    if docker inspect "$name" >/dev/null 2>&1; then
        echo "Experiment container already exists: $name" >&2
        exit 1
    fi
done
if docker network inspect "$bench_network" >/dev/null 2>&1; then
    echo "Experiment network already exists: $bench_network" >&2
    exit 1
fi
bench_jar="$(python3 -c 'import pathlib; print(next(pathlib.Path("api/build/libs").glob("*SNAPSHOT.jar")).resolve())')"
docker network create "$bench_network" >/dev/null
cleanup() {
    docker rm -f 'hubble-draft-k6-load' "$bench_app" "$bench_db" >/dev/null 2>&1 || true
    docker network rm "$bench_network" >/dev/null 2>&1 || true
}
trap cleanup EXIT
mkdir -p ../outputs/draft-k6-baseline
docker run --rm -d --name "$bench_db" --network "$bench_network" --cpus=2 --memory=1536m \
    -e MYSQL_ROOT_PASSWORD=draft-k6-local-test -e MYSQL_DATABASE=hubble_draft_k6 \
    mysql:8.0 >/dev/null
bench_ready=false
for ((attempt=0;attempt<60;attempt++)); do
    if docker exec "$bench_db" mysqladmin ping -uroot -pdraft-k6-local-test >/dev/null 2>&1; then
        bench_ready=true
        break
    fi
    sleep 1
done
if [[ "$bench_ready" != true ]]; then
    docker logs "$bench_db" >&2
    exit 1
fi
docker run --rm -d --name "$bench_app" --network "$bench_network" --cpus=2 --memory=768m \
    -p 127.0.0.1:18080:8080 -v "$bench_jar:/app/app.jar:ro" \
    -e SPRING_DATASOURCE_URL="jdbc:mysql://$bench_db:3306/hubble_draft_k6?serverTimezone=UTC&characterEncoding=UTF-8" \
    -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=draft-k6-local-test \
    -e SPRING_JPA_SHOW_SQL=false -e SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=false \
    -e LOGGING_LEVEL_ROOT=WARN -e GRAPH_WORKER_ENABLED=false \
    -e JWT_SECRET=draft-k6-benchmark-secret-key-2026 \
    eclipse-temurin:17-jre java -XX:ActiveProcessorCount=2 -Xms256m -Xmx512m -jar /app/app.jar >/dev/null
if ! python3 scripts/k6/draft-http-benchmark.py; then
    docker logs "$bench_app" > ../outputs/draft-k6-baseline/api.log 2>&1
    exit 1
fi
docker logs "$bench_app" > ../outputs/draft-k6-baseline/api.log 2>&1
