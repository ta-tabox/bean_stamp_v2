import { describe, expect, it } from "vitest"

import { readCurrentPath } from "@/server/request/read-current-path"

describe("readCurrentPath", () => {
  it("next-url を優先して返す", () => {
    const requestHeaders = new Headers({
      "next-url": "/users/home",
      "x-matched-path": "/fallback",
    })

    expect(readCurrentPath(requestHeaders)).toBe("/users/home")
  })

  it("next-url がなければ x-matched-path を返す", () => {
    const requestHeaders = new Headers({
      "x-matched-path": "/roasters/home",
    })

    expect(readCurrentPath(requestHeaders)).toBe("/roasters/home")
  })

  it("該当ヘッダーがなければ空文字を返す", () => {
    expect(readCurrentPath(new Headers())).toBe("")
  })
})
