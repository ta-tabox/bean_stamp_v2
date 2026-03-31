import { describe, expect, it } from "vitest"

import { buildLegacySessionResponse } from "@/server/auth/session"

describe("buildLegacySessionResponse", () => {
  it("未ログイン時のレスポンスを返す", () => {
    expect(buildLegacySessionResponse()).toEqual({
      is_login: false,
      message: "ユーザーが存在しません",
    })
  })

  it("ログイン時は user と roaster を返す", () => {
    expect(
      buildLegacySessionResponse({
        user: {
          email: "user@example.com",
          id: "10",
          name: "Test User",
          prefectureCode: "13",
          roasterId: "20",
        },
        roaster: {
          address: "Tokyo",
          id: "20",
          name: "Roaster",
          prefectureCode: "13",
        },
      }),
    ).toEqual({
      is_login: true,
      roaster: {
        address: "Tokyo",
        id: "20",
        name: "Roaster",
        prefecture_code: "13",
      },
      user: {
        email: "user@example.com",
        id: "10",
        name: "Test User",
        prefecture_code: "13",
        roaster_id: "20",
      },
    })
  })
})
