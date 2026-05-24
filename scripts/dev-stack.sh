#!/usr/bin/env bash
# Start CodeDrill API and app (apps/api + apps/app).
# From repo root: pnpm dev:stack  OR  ./scripts/dev-stack.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
pnpm turbo dev --filter=./apps/api --filter=./apps/app
