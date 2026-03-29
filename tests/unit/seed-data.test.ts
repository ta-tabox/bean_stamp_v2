import { describe, expect, it } from "vitest"

import { countriesSeedData, roastLevelsSeedData, tasteTagsSeedData } from "@/server/db/seed-data"

describe("seed data", () => {
  it("旧 fixture と互換のあるマスタ件数を保持している", () => {
    expect(roastLevelsSeedData).toHaveLength(6)
    expect(tasteTagsSeedData).toHaveLength(71)
    expect(countriesSeedData).toHaveLength(45)
  })

  it("先頭の未選択データを維持している", () => {
    expect(roastLevelsSeedData[0]).toEqual({ id: 0, name: "選択されていません" })
    expect(tasteTagsSeedData[0]).toEqual({
      id: 0,
      name: "選択されていません",
      tasteGroupId: 0,
    })
    expect(countriesSeedData[0]).toEqual({
      area: "",
      id: 0,
      name: "選択されていません",
    })
  })
})
