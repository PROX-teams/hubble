#!/usr/bin/env bash
set -euo pipefail
umask 077

cd "$(dirname "$0")/.."
graph_jar='api/build/libs/api-0.0.1-SNAPSHOT.jar'
if [[ ! -f "$graph_jar" ]]; then
    echo 'API JAR not found. Run ./gradlew :api:bootJar first.' >&2
    exit 1
fi
if ! nc -z 127.0.0.1 9092; then
    echo 'Kafka is not listening on 127.0.0.1:9092.' >&2
    exit 1
fi
if lsof -nP -iTCP:8080 -sTCP:LISTEN >/dev/null; then
    echo 'Port 8080 is already in use; stop that server first.' >&2
    exit 1
fi

read -r -s -p 'Local Hubble MySQL password: ' graph_db_password
printf '\n'
if ! MYSQL_PWD="$graph_db_password" mysql --protocol=tcp --host=127.0.0.1 \
    --user=hubble --batch --skip-column-names hubble -e 'SELECT 1' >/dev/null 2>&1; then
    unset graph_db_password
    echo 'MySQL TCP authentication failed. Check the password and try again.' >&2
    exit 1
fi
export SPRING_DATASOURCE_URL='jdbc:mysql://127.0.0.1:3306/hubble?serverTimezone=UTC&characterEncoding=UTF-8'
export SPRING_DATASOURCE_USERNAME='hubble'
export SPRING_DATASOURCE_PASSWORD="$graph_db_password"
export SPRING_KAFKA_BOOTSTRAP_SERVERS='127.0.0.1:9092'
export GRAPH_ASYNC_ENABLED='true'
unset graph_db_password

graph_run_dir=$(mktemp -d /private/tmp/hubble-graph-runtime.XXXXXX)
graph_worker_pid=''
graph_api_pid=''
cleanup() {
    trap - EXIT INT TERM
    if [[ -n "$graph_api_pid" ]]; then kill -TERM "$graph_api_pid" 2>/dev/null || true; fi
    if [[ -n "$graph_worker_pid" ]]; then kill -TERM "$graph_worker_pid" 2>/dev/null || true; fi
    if [[ -n "$graph_api_pid" ]]; then wait "$graph_api_pid" 2>/dev/null || true; fi
    if [[ -n "$graph_worker_pid" ]]; then wait "$graph_worker_pid" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

GRAPH_WORKER_ENABLED=true SPRING_MAIN_WEB_APPLICATION_TYPE=none \
    java -Xms128m -Xmx512m -jar "$graph_jar" > "$graph_run_dir/worker.log" 2>&1 &
graph_worker_pid=$!

for ((graph_attempt = 0; graph_attempt < 90; graph_attempt++)); do
    if grep -q 'Started ServerApplication' "$graph_run_dir/worker.log"; then break; fi
    if ! kill -0 "$graph_worker_pid" 2>/dev/null; then
        echo "Graph worker failed. See $graph_run_dir/worker.log" >&2
        exit 1
    fi
    sleep 1
done
if ! grep -q 'Started ServerApplication' "$graph_run_dir/worker.log"; then
    echo "Graph worker did not become ready. See $graph_run_dir/worker.log" >&2
    exit 1
fi

GRAPH_WORKER_ENABLED=false SERVER_PORT=8080 \
    java -Xms128m -Xmx512m -jar "$graph_jar" > "$graph_run_dir/api.log" 2>&1 &
graph_api_pid=$!
for ((graph_attempt = 0; graph_attempt < 90; graph_attempt++)); do
    if grep -q 'Started ServerApplication' "$graph_run_dir/api.log"; then break; fi
    if ! kill -0 "$graph_api_pid" 2>/dev/null; then
        echo "API failed. See $graph_run_dir/api.log" >&2
        exit 1
    fi
    sleep 1
done
if ! grep -q 'Started ServerApplication' "$graph_run_dir/api.log"; then
    echo "API did not become ready. See $graph_run_dir/api.log" >&2
    exit 1
fi

echo 'Graph worker and API are running in asynchronous mode.'
echo "Logs: $graph_run_dir"
echo 'Press Ctrl+C to stop both processes.'
while kill -0 "$graph_worker_pid" 2>/dev/null && kill -0 "$graph_api_pid" 2>/dev/null; do
    sleep 2
done
echo "A process exited unexpectedly. See $graph_run_dir" >&2
exit 1
