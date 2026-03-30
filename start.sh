#!/bin/sh
PORT="${PORT:-8080}"
echo "INFO: Starting Uvicorn on 0.0.0.0:${PORT}"
exec uvicorn backend.api.main:app --host 0.0.0.0 --port "${PORT}" --workers 2
