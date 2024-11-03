#!/bin/bash
set -e

npm install
npm run dev
.venv/bin/uvicorn --reload --port 8000 --app-dir "/root/app" api.main:app