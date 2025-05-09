#!/bin/bash
set -e

# Run npm in the background
npm run dev &

# Run uvicorn in the background
.venv/bin/uvicorn --reload --port 8000 --app-dir "/root/app" api.main:app &

# Wait for both background processes to finish
wait