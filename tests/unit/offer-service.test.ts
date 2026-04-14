import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppError } from "@/server/errors"

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    offer: {
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

import { calculateOfferStatus, deleteOffer, parseOfferMutationInput } from "@/server/offers"

describe("offers/service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("日付の前後関係が不正だと AppError を送出する", () => {
    expect(() =>
      parseOfferMutationInput({
        amount: "10",
        beanId: "4",
        endedAt: "2026-04-15",
        price: "1800",
        receiptEndedAt: "2026-04-17",
        receiptStartedAt: "2026-04-16",
        roastedAt: "2026-04-15",
        weight: "200",
      }),
    ).toThrowError(AppError)
  })

  it("日付境界に応じて Offer ステータスを計算する", () => {
    const schedule = {
      endedAt: new Date("2026-04-14T00:00:00.000Z"),
      receiptEndedAt: new Date("2026-04-18T00:00:00.000Z"),
      receiptStartedAt: new Date("2026-04-17T00:00:00.000Z"),
      roastedAt: new Date("2026-04-15T00:00:00.000Z"),
    }

    expect(calculateOfferStatus(schedule, new Date("2026-04-14T00:00:00.000Z"))).toBe("on_offering")
    expect(calculateOfferStatus(schedule, new Date("2026-04-15T00:00:00.000Z"))).toBe("on_roasting")
    expect(calculateOfferStatus(schedule, new Date("2026-04-16T00:00:00.000Z"))).toBe(
      "on_preparing",
    )
    expect(calculateOfferStatus(schedule, new Date("2026-04-17T00:00:00.000Z"))).toBe("on_selling")
    expect(calculateOfferStatus(schedule, new Date("2026-04-19T00:00:00.000Z"))).toBe(
      "end_of_sales",
    )
  })

  it("ウォント済みオファーは削除できない", async () => {
    mockPrisma.offer.findFirst.mockResolvedValue({
      _count: {
        wants: 1,
      },
      id: 1n,
    })

    await expect(deleteOffer("3", "1")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      userMessage: "オファーはウォントされています",
    })
  })
})
