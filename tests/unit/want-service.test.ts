import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    offer: {
      findUnique: vi.fn(),
    },
    want: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

import { createWant, getWantsStatsForUser, rateWant } from "@/server/wants"

describe("wants/service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("createWant は数量上限に達していると失敗する", async () => {
    mockPrisma.offer.findUnique.mockResolvedValue({
      _count: {
        wants: 5,
      },
      amount: 5,
      endedAt: new Date("2099-04-14T00:00:00.000Z"),
      id: 1n,
      receiptEndedAt: new Date("2099-04-18T00:00:00.000Z"),
      receiptStartedAt: new Date("2099-04-17T00:00:00.000Z"),
      roastedAt: new Date("2099-04-15T00:00:00.000Z"),
    })

    await expect(createWant("3", "1")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      userMessage: "数量が上限に達しています",
    })
  })

  it("getWantsStatsForUser は未受け取り件数を含めて集計する", async () => {
    const now = new Date()

    mockPrisma.want.findMany.mockResolvedValue([
      {
        offer: {
          endedAt: offsetDate(now, 1),
          receiptEndedAt: offsetDate(now, 4),
          receiptStartedAt: offsetDate(now, 3),
          roastedAt: offsetDate(now, 2),
        },
        receiptedAt: null,
      },
      {
        offer: {
          endedAt: offsetDate(now, -3),
          receiptEndedAt: offsetDate(now, 1),
          receiptStartedAt: offsetDate(now, -1),
          roastedAt: offsetDate(now, -2),
        },
        receiptedAt: null,
      },
    ])

    expect(await getWantsStatsForUser("7")).toEqual({
      end_of_sales: 0,
      not_receipted: 1,
      on_offering: 1,
      on_preparing: 0,
      on_roasting: 0,
      on_selling: 1,
    })
  })

  it("rateWant は既に評価済みなら失敗する", async () => {
    mockPrisma.want.findFirst.mockResolvedValue({
      id: 5n,
      rate: "good",
    })

    await expect(rateWant("3", "5", "excellent")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      userMessage: "すでに評価が完了しています",
    })
  })
})

function offsetDate(base: Date, days: number) {
  const value = new Date(base)

  value.setUTCDate(value.getUTCDate() + days)
  value.setUTCHours(0, 0, 0, 0)

  return value
}
