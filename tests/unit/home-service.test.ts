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
        bean: {
          beanImages: [{ image: "https://example.com/bean.jpg" }],
          country: { name: "Ethiopia" },
          name: "Test Bean",
          process: "Washed",
          roastLevel: { name: "Light" },
          roaster: {
            id: 5n,
            image: "https://example.com/roaster.jpg",
            name: "Roaster Five",
          },
        },
        id: 9n,
        price: 1800,
        status: OfferStatus.on_offering,
        weight: 200,
      }),
    ).toEqual({
      beanImageUrl: "https://example.com/bean.jpg",
      beanName: "Test Bean",
      countryName: "Ethiopia",
      id: "9",
      price: 1800,
      process: "Washed",
      roastLevelName: "Light",
      roasterId: "5",
      roasterImageUrl: "https://example.com/roaster.jpg",
      roasterName: "Roaster Five",
      status: OfferStatus.on_offering,
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
