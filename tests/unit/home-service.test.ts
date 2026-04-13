import { OfferStatus } from "@prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    offer: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

import {
  buildHomeOfferCard,
  listCurrentOffersForRoasterHome,
  listCurrentOffersForUserHome,
} from "@/server/home/service"

describe("home/service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("ホーム用オファー DTO を表示向けに正規化する", () => {
    expect(
      buildHomeOfferCard({
        _count: { wants: 4 },
        amount: 12,
        bean: {
          acidity: 4,
          beanImages: [{ image: "https://example.com/bean.jpg" }],
          beanTasteTags: [
            {
              tasteTag: {
                name: "rose",
              },
            },
            {
              tasteTag: {
                name: "orange",
              },
            },
          ],
          bitterness: 2,
          body: 3,
          country: { name: "Ethiopia" },
          flavor: 5,
          name: "Test Bean",
          process: "Washed",
          roastLevel: { name: "Light" },
          roaster: {
            id: 5n,
            image: "https://example.com/roaster.jpg",
            name: "Roaster Five",
          },
          sweetness: 1,
        },
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        endedAt: new Date("2026-04-10T00:00:00.000Z"),
        id: 9n,
        price: 1800,
        receiptEndedAt: new Date("2026-04-14T00:00:00.000Z"),
        receiptStartedAt: new Date("2026-04-12T00:00:00.000Z"),
        roastedAt: new Date("2026-04-11T00:00:00.000Z"),
        status: OfferStatus.on_offering,
        weight: 200,
      }),
    ).toEqual({
      acidity: 4,
      amount: 12,
      beanImageUrl: "https://example.com/bean.jpg",
      beanName: "Test Bean",
      bitterness: 2,
      body: 3,
      countryName: "Ethiopia",
      createdAt: "2026-04-01",
      endedAt: "2026-04-10",
      flavor: 5,
      id: "9",
      price: 1800,
      process: "Washed",
      receiptEndedAt: "2026-04-14",
      receiptStartedAt: "2026-04-12",
      roastLevelName: "Light",
      roastedAt: "2026-04-11",
      roasterId: "5",
      roasterImageUrl: "https://example.com/roaster.jpg",
      roasterName: "Roaster Five",
      status: OfferStatus.on_offering,
      sweetness: 1,
      tasteNames: ["rose", "orange"],
      wantsCount: 4,
      weight: 200,
    })
  })

  it("ユーザーホームはフォロー中ロースターの募集中オファーを取得する", async () => {
    mockPrisma.offer.findMany.mockResolvedValue([])

    await listCurrentOffersForUserHome("7")

    expect(mockPrisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        where: {
          bean: {
            roaster: {
              followers: {
                some: {
                  followerId: 7n,
                },
              },
            },
          },
          status: {
            not: OfferStatus.end_of_sales,
          },
        },
      }),
    )
  })

  it("ロースターホームは自身のオファーを取得する", async () => {
    mockPrisma.offer.findMany.mockResolvedValue([])

    await listCurrentOffersForRoasterHome("5")

    expect(mockPrisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        where: {
          bean: {
            roasterId: 5n,
          },
        },
      }),
    )
  })
})
