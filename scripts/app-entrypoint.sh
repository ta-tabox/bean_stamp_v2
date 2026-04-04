#!/bin/sh
set -eu

if [ "$#" -eq 0 ]; then
  set -- pnpm dev --hostname 0.0.0.0
fi

if [ "$1" = "pnpm" ] && [ "${2:-}" = "dev" ]; then
  pnpm prisma:migrate:deploy
fi

exec "$@"
