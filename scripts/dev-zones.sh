#!/usr/bin/env bash
# Start with-zones app and all its zoned apps (render-lab, with-optimization, with-scalable, with-arcjet).
# From repo root: pnpm dev:zones  OR  ./scripts/dev-zones.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
pnpm turbo dev --filter=with-zones --filter=with-arcjet --filter=with-optimization --filter=with-scalable --filter=render-lab
