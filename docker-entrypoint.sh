#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Add MongoDB Atlas URL to .env.local"
  exit 1
fi

echo "→ bun install"
bun install

if [ "$SEED_ON_START" = "1" ]; then
  echo "→ db seed"
  bun --env-file=.env.local scripts/seed.ts
fi

echo "→ next dev (webpack)"
exec bunx next dev --webpack -H 0.0.0.0 -p 3000
