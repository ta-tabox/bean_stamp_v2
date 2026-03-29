import { describe, expect, it } from "vitest"

import { toApiErrorResponse } from "@/server/api"
import { AppError } from "@/server/errors"

describe("toApiErrorResponse", () => {
  it("AppError を API レスポンス形式へ変換する", () => {
    const response = toApiErrorResponse(
      new AppError("Unauthorized", {
        code: "UNAUTHORIZED",
        status: 401,
        userMessage: "認証が必要です。",
      }),
    )

    expect(response.status).toBe(401)
    expect(response.payload).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "認証が必要です。",
      },
    })
  })

  it("未知の例外は INTERNAL_ERROR として変換する", () => {
    const response = toApiErrorResponse(new Error("boom"))

    expect(response.status).toBe(500)
    expect(response.payload.error.code).toBe("INTERNAL_ERROR")
  })
})
