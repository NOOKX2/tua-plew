#!/bin/sh
set -e

# Docker sets DATABASE_URL=...@db:5432 — do not let .env.local (localhost) override it.
export DATABASE_URL="${DATABASE_URL:-postgresql://fittogo:fittogo@db:5432/fittogo}"

echo "→ bun install"
bun install

echo "→ prisma db push (DATABASE_URL=${DATABASE_URL})"
bunx prisma db push

echo "→ prisma db seed"
bunx prisma db seed

echo "→ prisma generate"
bunx prisma generate

echo "→ next dev (webpack — stable with auth/prisma in Docker)"
exec bunx next dev --webpack -H 0.0.0.0 -p 3000
