#!/usr/bin/env bash
set -e
host="${POSTGRES_HOST:-db}"
port="${POSTGRES_PORT:-5432}"
timeout="${POSTGRES_TIMEOUT:-30}"

for ((i=0; i<timeout; i++)); do
  if (echo > /dev/tcp/$host/$port) 2>/dev/null; then
    echo "✅ Postgres is up!"
    exit 0
  fi
  sleep 1
  echo "waiting for postgres… $((timeout-i))s left"
done

echo "❌ Postgres not reachable" && exit 1
