#!/usr/bin/env bash
set -euo pipefail

# Run interactively only after a verified backup and while note writes are stopped.
# The password is read without echoing and is not written to this script or shell history.
cd "$(dirname "$0")/.."
read -r -s -p 'Local Hubble MySQL password: ' graph_db_password
printf '\n'

export SPRING_DATASOURCE_URL='jdbc:mysql://127.0.0.1:3306/hubble?serverTimezone=UTC&characterEncoding=UTF-8'
export SPRING_DATASOURCE_USERNAME='hubble'
export SPRING_DATASOURCE_PASSWORD="$graph_db_password"
export SERVER_PORT='18080'
export GRAPH_ASYNC_ENABLED='false'
export GRAPH_WORKER_ENABLED='false'
unset graph_db_password

./gradlew :api:bootRun --console=plain
