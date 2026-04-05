import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

const composePath = path.join(process.cwd(), "compose.yml")
const dockerfilePath = path.join(process.cwd(), "Dockerfile.e2e")
const entrypointPath = path.join(process.cwd(), "scripts", "e2e-entrypoint.sh")
const runE2eScriptPath = path.join(process.cwd(), "scripts", "run-e2e.sh")

describe("E2E compose configuration", () => {
  it("e2e コンテナが通常開発 DB と別 database を使う", () => {
    const compose = readFileSync(composePath, "utf8")

    expect(compose).toContain("DATABASE_URL: postgresql://postgres:postgres@db:5432/bean_stamp")
    expect(compose).toContain("DATABASE_URL: postgresql://postgres:postgres@db:5432/bean_stamp_e2e")
  })

  it("e2e コンテナは app コンテナに依存せず db のみへ依存する", () => {
    const compose = readFileSync(composePath, "utf8")

    expect(compose).toContain("  e2e:\n")
    expect(compose).toContain("    depends_on:\n      db:\n        condition: service_healthy")
    expect(compose).not.toContain("    depends_on:\n      app:\n        condition: service_started")
  })
})

describe("E2E runtime files", () => {
  it("E2E entrypoint は常駐コンテナ用の待機プロセスを既定にする", () => {
    const entrypoint = readFileSync(entrypointPath, "utf8")

    expect(entrypoint).toContain("set -- sleep infinity")
  })

  it("E2E 実行スクリプトが DB 初期化とアプリ再起動を担う", () => {
    const runE2eScript = readFileSync(runE2eScriptPath, "utf8")

    expect(runE2eScript).toContain("pnpm prisma:generate")
    expect(runE2eScript).toContain("pnpm prisma:reset:e2e")
    expect(runE2eScript).toContain("pnpm dev --hostname 0.0.0.0")
    expect(runE2eScript).toContain("curl -fsS")
    expect(runE2eScript).toContain("CREATE DATABASE")
    expect(runE2eScript).toContain("pnpm test:e2e:spec")
  })

  it("E2E image に database 作成用の PostgreSQL クライアントを含める", () => {
    const dockerfile = readFileSync(dockerfilePath, "utf8")

    expect(dockerfile).toContain("postgresql-client")
  })
})
