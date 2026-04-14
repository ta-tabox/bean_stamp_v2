import { describe, expect, it } from "vitest"

import { getToastStatusMeta } from "@/components/ui/toast"

describe("components/ui/toast", () => {
  it("success の表示メタデータを返す", () => {
    expect(getToastStatusMeta("success")).toEqual({
      ariaLive: "polite",
      role: "status",
    })
  })

  it("error の表示メタデータを返す", () => {
    expect(getToastStatusMeta("error")).toEqual({
      ariaLive: "assertive",
      role: "alert",
    })
  })
})
