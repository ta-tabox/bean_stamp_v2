#!/bin/sh
set -eu

if [ "$#" -eq 0 ]; then
  set -- pnpm test:e2e
fi

exec "$@"
