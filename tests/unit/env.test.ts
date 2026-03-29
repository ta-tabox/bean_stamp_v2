import { describe, expect, it } from "vitest"

import { loadServerEnv } from "@/env"

describe("loadServerEnv", () => {
  it("必要な環境変数を正規化して返す", () => {
    const env = loadServerEnv({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/bean_stamp",
      GCS_BUCKET_UPLOADS: "bean-stamp-uploads",
      GOOGLE_CLOUD_PROJECT: "bean-stamp-dev",
      NEXTAUTH_SECRET: "secret",
      NEXTAUTH_URL: "http://localhost:3000",
      NODE_ENV: "test",
    })

    expect(env.NODE_ENV).toBe("test")
    expect(env.NEXTAUTH_URL).toBe("http://localhost:3000")
    expect(env.GOOGLE_CLOUD_PROJECT).toBe("bean-stamp-dev")
  })

  it("不足した環境変数がある場合は失敗する", () => {
    expect(() =>
      loadServerEnv({
        NEXTAUTH_SECRET: "secret",
        NEXTAUTH_URL: "http://localhost:3000",
      }),
    ).toThrow()
  })
})
