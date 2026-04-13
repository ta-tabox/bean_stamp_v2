import { describe, expect, it } from "vitest"

import { buildRadarPolygon } from "@/components/home/HomeTasteChart"

describe("home/HomeTasteChart", () => {
  it("最大値で外周の5角形を返す", () => {
    const points = buildRadarPolygon([5, 5, 5, 5, 5], 72, 120)

    expect(points).toHaveLength(5)
    expect(points[0]).toEqual({ x: 120, y: 48 })
  })

  it("値を 0..5 の範囲に丸めて内側へ反映する", () => {
    const points = buildRadarPolygon([-1, 2.5, 10, 0, 5], 72, 120)

    expect(points[0]).toEqual({ x: 120, y: 120 })
    expect(points[1].x).toBeGreaterThan(120)
    expect(points[2].y).toBeGreaterThan(120)
    expect(points[3]).toEqual({ x: 120, y: 120 })
    expect(points[4].x).toBeLessThan(120)
  })
})
