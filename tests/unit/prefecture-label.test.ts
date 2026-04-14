import { describe, expect, it } from "vitest"

import { resolvePrefectureLabel } from "@/components/shared/prefecture-label"

describe("resolvePrefectureLabel", () => {
  it("都道府県コードを都道府県名へ変換する", () => {
    expect(resolvePrefectureLabel("13")).toBe("東京都")
    expect(resolvePrefectureLabel("27")).toBe("大阪府")
    expect(resolvePrefectureLabel("47")).toBe("沖縄県")
  })

  it("1桁コードも 0 埋めして変換する", () => {
    expect(resolvePrefectureLabel("1")).toBe("北海道")
    expect(resolvePrefectureLabel("9")).toBe("栃木県")
  })

  it("不正な値はそのまま返す", () => {
    expect(resolvePrefectureLabel("99")).toBe("99")
    expect(resolvePrefectureLabel("tokyo")).toBe("tokyo")
    expect(resolvePrefectureLabel("")).toBe("")
  })
})
