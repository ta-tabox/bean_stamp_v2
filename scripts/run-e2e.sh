#!/bin/sh
set -eu

APP_LOG_FILE=/tmp/bean-stamp-e2e-app.log
APP_PID_FILE=/tmp/bean-stamp-e2e-app.pid
E2E_DB_ADMIN_URL="${E2E_DB_ADMIN_URL:-}"
E2E_DATABASE_NAME="${E2E_DATABASE_NAME:-bean_stamp_e2e}"

main() {
  pnpm prisma:generate
  wait_for_database
  ensure_e2e_database
  pnpm prisma:reset:e2e
  restart_application
  wait_for_application
  pnpm test:e2e:spec
}

wait_for_database() {
  if [ -z "${E2E_DB_ADMIN_URL}" ]; then
    return
  fi

  until psql "${E2E_DB_ADMIN_URL}" -c "SELECT 1" >/dev/null 2>&1; do
    sleep 1
  done
}

ensure_e2e_database() {
  if [ -z "${E2E_DB_ADMIN_URL}" ]; then
    return
  fi

  if psql "${E2E_DB_ADMIN_URL}" -tAc \
    "SELECT 1 FROM pg_database WHERE datname = '${E2E_DATABASE_NAME}'" | grep -q 1; then
    return
  fi

  psql "${E2E_DB_ADMIN_URL}" -c "CREATE DATABASE ${E2E_DATABASE_NAME}"
}

restart_application() {
  stop_existing_application

  : >"${APP_LOG_FILE}"
  pnpm dev --hostname 0.0.0.0 >"${APP_LOG_FILE}" 2>&1 &
  echo "$!" >"${APP_PID_FILE}"
}

stop_existing_application() {
  if [ ! -f "${APP_PID_FILE}" ]; then
    return
  fi

  existing_pid=$(cat "${APP_PID_FILE}")

  if kill -0 "${existing_pid}" 2>/dev/null; then
    kill "${existing_pid}"
    wait "${existing_pid}" || true
  fi

  rm -f "${APP_PID_FILE}"
}

wait_for_application() {
  while true; do
    if curl -fsS "${PLAYWRIGHT_BASE_URL}" >/dev/null 2>&1; then
      return
    fi

    if ! app_is_running; then
      cat "${APP_LOG_FILE}" >&2
      exit 1
    fi

    sleep 1
  done
}

app_is_running() {
  if [ ! -f "${APP_PID_FILE}" ]; then
    return 1
  fi

  app_pid=$(cat "${APP_PID_FILE}")
  kill -0 "${app_pid}" 2>/dev/null
}

main "$@"
