import { describe, expect, it } from "vitest"

import { calculateOfferStatus } from "@/server/offers"
import {
  buildOfferScheduleFromSeedDate,
  developmentBeans,
  developmentFollows,
  developmentLikes,
  developmentOffers,
  developmentRoasters,
  developmentUsers,
  developmentWants,
  summarizeOfferStatuses,
} from "../../prisma/seed-development-data"

describe("development seed data", () => {
  it("UI 確認向けに十分な件数のユーザー、ロースター、豆、オファーを持つ", () => {
    expect(developmentRoasters.length).toBeGreaterThanOrEqual(4)
    expect(developmentUsers.length).toBeGreaterThanOrEqual(8)
    expect(developmentBeans.length).toBeGreaterThanOrEqual(8)
    expect(developmentOffers.length).toBeGreaterThanOrEqual(10)
    expect(developmentFollows.length).toBeGreaterThanOrEqual(8)
    expect(developmentLikes.length).toBeGreaterThanOrEqual(4)
    expect(developmentWants.length).toBeGreaterThanOrEqual(4)
  })

  it("各オファーは seed 実行日基準で想定ステータスになるスケジュールを持つ", () => {
    const seedDate = new Date("2026-04-14T00:00:00.000Z")

    for (const offer of developmentOffers) {
      const schedule = buildOfferScheduleFromSeedDate(seedDate, offer.schedulePreset)

      expect(calculateOfferStatus(schedule, seedDate)).toBe(offer.schedulePreset)
    }
  })

  it("全ステータスのオファーが最低 1 件ずつ存在する", () => {
    const summary = summarizeOfferStatuses(new Date("2026-04-14T00:00:00.000Z"))

    expect(summary.on_offering).toBeGreaterThan(0)
    expect(summary.on_roasting).toBeGreaterThan(0)
    expect(summary.on_preparing).toBeGreaterThan(0)
    expect(summary.on_selling).toBeGreaterThan(0)
    expect(summary.end_of_sales).toBeGreaterThan(0)
  })
})
