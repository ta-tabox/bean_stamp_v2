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
      buildHomeOfferCard(
        {
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
          likes: [{ id: 14n, userId: 77n }],
          price: 1800,
          receiptEndedAt: new Date("2026-04-14T00:00:00.000Z"),
          receiptStartedAt: new Date("2026-04-12T00:00:00.000Z"),
          roastedAt: new Date("2026-04-11T00:00:00.000Z"),
          wants: [{ id: 15n, userId: 77n }],
          weight: 200,
        },
        77n,
        new Date("2026-04-14T00:00:00.000Z"),
      ),
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
      initialLikeId: 14,
      initialWantId: 15,
      price: 1800,
      process: "Washed",
      receiptEndedAt: "2026-04-14",
      receiptStartedAt: "2026-04-12",
      roastLevelName: "Light",
      roastedAt: "2026-04-11",
      roasterId: "5",
      roasterImageUrl: "https://example.com/roaster.jpg",
      roasterName: "Roaster Five",
      status: OfferStatus.on_selling,
      sweetness: 1,
      tasteNames: ["rose", "orange"],
      wantsCount: 4,
      weight: 200,
    })
  })

  it("ホーム用オファー DTO では保存済み status ではなく日付から状態を再計算する", () => {
    expect(
      buildHomeOfferCard(
        {
          _count: { wants: 1 },
          amount: 3,
          bean: {
            acidity: 1,
            beanImages: [],
            beanTasteTags: [],
            bitterness: 1,
            body: 1,
            country: { name: "Japan" },
            flavor: 1,
            name: "Timed Offer",
            process: "Washed",
            roastLevel: { name: "Light" },
            roaster: {
              id: 5n,
              image: null,
              name: "Roaster Five",
            },
            sweetness: 1,
          },
          createdAt: new Date("2026-04-01T00:00:00.000Z"),
          endedAt: new Date("2026-04-10T00:00:00.000Z"),
          id: 10n,
          likes: [],
          price: 1800,
          receiptEndedAt: new Date("2026-04-14T00:00:00.000Z"),
          receiptStartedAt: new Date("2026-04-12T00:00:00.000Z"),
          roastedAt: new Date("2026-04-11T00:00:00.000Z"),
          wants: [],
          weight: 200,
        },
        77n,
        new Date("2026-04-14T00:00:00.000Z"),
      ).status,
    ).toBe(OfferStatus.on_selling)
  })

  it("ユーザーホームはフォロー中ロースターの募集中オファーを取得する", async () => {
    mockPrisma.offer.findMany.mockResolvedValue([])

    await listCurrentOffersForUserHome("7")

    expect(mockPrisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
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
          receiptEndedAt: {
            gte: expect.any(Date),
          },
        },
      }),
    )
  })

  it("ユーザーホームは受け取り終了済みオファーを除外し、状態も再計算する", async () => {
    mockPrisma.offer.findMany.mockResolvedValue([
      {
        _count: { wants: 2 },
        amount: 5,
        bean: {
          acidity: 2,
          beanImages: [],
          beanTasteTags: [],
          bitterness: 2,
          body: 2,
          country: { name: "Japan" },
          flavor: 2,
          name: "Expired Offer",
          process: "Natural",
          roastLevel: { name: "Light" },
          roaster: {
            id: 5n,
            image: null,
            name: "Roaster Five",
          },
          sweetness: 2,
        },
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        endedAt: new Date("2026-04-10T00:00:00.000Z"),
        id: 11n,
        likes: [],
        price: 1800,
        receiptEndedAt: new Date("2026-04-13T00:00:00.000Z"),
        receiptStartedAt: new Date("2026-04-12T00:00:00.000Z"),
        roastedAt: new Date("2026-04-11T00:00:00.000Z"),
        wants: [],
        weight: 200,
      },
      {
        _count: { wants: 1 },
        amount: 5,
        bean: {
          acidity: 2,
          beanImages: [],
          beanTasteTags: [],
          bitterness: 2,
          body: 2,
          country: { name: "Japan" },
          flavor: 2,
          name: "Active Offer",
          process: "Natural",
          roastLevel: { name: "Light" },
          roaster: {
            id: 5n,
            image: null,
            name: "Roaster Five",
          },
          sweetness: 2,
        },
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        endedAt: new Date("2026-04-10T00:00:00.000Z"),
        id: 12n,
        likes: [],
        price: 1800,
        receiptEndedAt: new Date("2999-04-14T00:00:00.000Z"),
        receiptStartedAt: new Date("2999-04-12T00:00:00.000Z"),
        roastedAt: new Date("2999-04-11T00:00:00.000Z"),
        wants: [],
        weight: 200,
      },
    ])

    const offers = await listCurrentOffersForUserHome("7", new Date("2026-04-14T00:00:00.000Z"))

    expect(offers).toHaveLength(1)
    expect(offers[0]).toMatchObject({
      beanName: "Active Offer",
      status: OfferStatus.on_roasting,
    })
  })

  it("ロースターホームは自身のオファーを取得する", async () => {
    mockPrisma.offer.findMany.mockResolvedValue([])

    await listCurrentOffersForRoasterHome("5", "7")

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
