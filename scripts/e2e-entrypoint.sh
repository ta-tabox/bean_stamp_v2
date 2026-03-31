#!/bin/sh
set -eu

if [ "$#" -eq 0 ]; then
  set -- pnpm test:e2e
fi

if [ "$1" = "pnpm" ] && [ "${2:-}" = "test:e2e" ]; then
  pnpm prisma:generate
fi

exec "$@"
