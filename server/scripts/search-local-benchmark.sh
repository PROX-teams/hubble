#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "${SEARCH_STORY_ANALYSIS:-false}" == true && "${SEARCH_BENCHMARK:-true}" == true ]]; then
    echo 'For story analysis, set SEARCH_BENCHMARK=false to avoid seeding twice.' >&2
    exit 1
fi

# This script owns one disposable container and never targets the application DB.
search_test_container='hubble-search-benchmark'
if docker inspect "$search_test_container" >/dev/null 2>&1; then
    echo "Container $search_test_container already exists; stop your previous test container first." >&2
    exit 1
fi

docker run --rm --detach --name "$search_test_container" \
    --publish 127.0.0.1:13316:3306 \
    --env MYSQL_ROOT_PASSWORD=search-local-test \
    --env MYSQL_DATABASE=hubble_search_benchmark \
    --memory=1536m --cpus=2 mysql:8.0 \
    --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci \
    --ngram-token-size=2
trap 'docker stop "$search_test_container" >/dev/null 2>&1 || true' EXIT

search_db_ready=false
for attempt in $(seq 1 60); do
    if docker exec "$search_test_container" mysqladmin ping --host=127.0.0.1 -uroot -psearch-local-test >/dev/null 2>&1; then
        search_db_ready=true
        break
    fi
    sleep 1
done
if [[ "$search_db_ready" != true ]]; then
    docker logs "$search_test_container" >&2
    exit 1
fi

search_gradle_args=(--no-daemon)
if [[ "${SEARCH_OFFLINE:-false}" == true ]]; then search_gradle_args+=(--offline); fi
if [[ -n "${JAVA_HOME:-}" ]]; then
    search_gradle_args+=(-Porg.gradle.java.installations.auto-detect=false
                        "-Porg.gradle.java.installations.paths=$JAVA_HOME")
fi

SEARCH_MYSQL_TESTS=true SEARCH_BENCHMARK="${SEARCH_BENCHMARK:-true}" \
SEARCH_BENCHMARK_NOTES="${SEARCH_BENCHMARK_NOTES:-20000}" \
./gradlew "${search_gradle_args[@]}" :api:test --rerun-tasks \
    --tests com.hubble.search.service.SearchMysqlIntegrationTest \
    --tests com.hubble.search.service.SearchServiceTest \
    --tests com.hubble.search.service.SearchMigrationTest

if [[ "${SEARCH_STORY_ANALYSIS:-false}" == true ]]; then
    echo "Raw measurements: server/api/build/reports/search-benchmark/story-${SEARCH_ANALYSIS_LABEL:-analysis}.json"
else
    echo 'Raw measurements: server/api/build/reports/search-benchmark/results.json'
fi
echo 'Test report: server/api/build/reports/tests/test/index.html'
