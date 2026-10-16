#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
container='hubble-draft-measure'
if docker inspect "$container" >/dev/null 2>&1; then
    echo "Measurement container already exists: $container" >&2
    exit 1
fi
docker run --rm -d --name "$container" \
    -e MYSQL_ROOT_PASSWORD=draft-local-test \
    -e MYSQL_DATABASE=hubble_draft_benchmark \
    -p 127.0.0.1:13326:3306 mysql:8.0 >/dev/null
trap 'docker stop "$container" >/dev/null 2>&1 || true' EXIT
ready=false
for ((attempt=0;attempt<60;attempt++)); do
    if docker exec "$container" mysqladmin ping -uroot -pdraft-local-test >/dev/null 2>&1; then
        ready=true
        break
    fi
    sleep 1
done
if [[ "$ready" != true ]]; then
    echo 'Measurement database did not become ready' >&2
    exit 1
fi
DRAFT_MEASURE=true ./gradlew :api:test --rerun-tasks \
    --tests com.hubble.note.service.DraftMeasurementTest
echo 'Measurements: api/build/reports/draft-measurement/results.json'
