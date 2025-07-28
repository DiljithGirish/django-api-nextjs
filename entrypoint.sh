#!/usr/bin/env bash
set -e

if [[ "${DATABASE_URL}" == postgres* ]]; then
  /usr/local/bin/postgres.sh
fi

echo "🛠  migrate" && python manage.py migrate --no-input

echo "📦  collectstatic" && python manage.py collectstatic --no-input

echo "🚀  gunicorn"
exec gunicorn RestaurantCore.wsgi:application \
     --bind 0.0.0.0:8000 \
     --workers "${GUNICORN_WORKERS:-3}"
