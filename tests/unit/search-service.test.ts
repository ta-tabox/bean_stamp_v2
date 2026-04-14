import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    offer: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    roaster: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

import {
  listRecommendedOffersForUser,
  listRoastersBySearch,
  searchOffers,
} from "@/server/search/service"

describe("search/service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("ロースター検索は名称と都道府県コードで絞り込み、ページング情報を返す", async () => {
    mockPrisma.roaster.count.mockResolvedValue(12)
    mockPrisma.roaster.findMany.mockResolvedValue([
      {
        address: "Tokyo",
        describe: "都内の小さな焙煎所",
        guest: false,
        id: 8n,
        image: "https://example.com/roaster.jpg",
        name: "Tokyo Roaster",
        phoneNumber: "03-0000-0000",
        prefectureCode: "13",
      },
    ])

    const result = await listRoastersBySearch({
      name: "Tokyo",
      page: "2",
      prefectureCode: "13",
    })

    expect(mockPrisma.roaster.count).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "Tokyo",
          mode: "insensitive",
        },
        prefectureCode: "13",
      },
    })
    expect(mockPrisma.roaster.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: 10,
        take: 10,
        where: {
          name: {
            contains: "Tokyo",
            mode: "insensitive",
          },
          prefectureCode: "13",
        },
      }),
    )
    expect(result.pagination).toEqual({
      currentPage: 2,
      pageSize: 10,
      totalCount: 12,
      totalPages: 2,
    })
    expect(result.items).toEqual([
      expect.objectContaining({
        id: 8,
        name: "Tokyo Roaster",
        prefecture_code: "13",
      }),
    ])
  })

  it("オファー検索は募集期間内のオファーだけを条件付きで返す", async () => {
    mockPrisma.offer.count.mockResolvedValue(1)
    mockPrisma.offer.findMany.mockResolvedValue([
      {
        _count: { wants: 3 },
        amount: 12,
        bean: {
          acidity: 4,
          beanImages: [{ image: "https://example.com/bean.jpg" }],
          beanTasteTags: [{ tasteTag: { id: 4n, name: "rose" } }],
          bitterness: 2,
          body: 3,
          country: { id: 44n, name: "日本" },
          croppedAt: null,
          describe: "豆の説明",
          elevation: 1200,
          farm: "Test Farm",
          flavor: 5,
          id: 15n,
          name: "Search Blend",
          process: "Washed",
          roastLevel: { id: 2n, name: "中浅煎り" },
          roaster: {
            id: 5n,
            image: "https://example.com/roaster.jpg",
            name: "Search Roaster",
          },
          roasterId: 5n,
          subregion: "Tokyo",
          sweetness: 3,
          variety: "Bourbon",
        },
        beanId: 15n,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        endedAt: new Date("2026-04-20T00:00:00.000Z"),
        id: 9n,
        likes: [],
        price: 1800,
        receiptEndedAt: new Date("2026-04-24T00:00:00.000Z"),
        receiptStartedAt: new Date("2026-04-23T00:00:00.000Z"),
        roastedAt: new Date("2026-04-22T00:00:00.000Z"),
        status: "on_offering",
        wants: [],
        weight: 200,
      },
    ])

    const result = await searchOffers(
      {
        countryId: "44",
        page: "1",
        prefectureCode: "13",
        roastLevelId: "2",
        tasteTagId: "4",
      },
      "7",
      new Date("2026-04-14T00:00:00.000Z"),
    )

    expect(mockPrisma.offer.count).toHaveBeenCalledWith({
      where: {
        bean: {
          countryId: 44n,
          roastLevelId: 2n,
          roaster: {
            prefectureCode: "13",
          },
          beanTasteTags: {
            some: {
              tasteTagId: 4n,
            },
          },
        },
        endedAt: {
          gte: new Date("2026-04-14T00:00:00.000Z"),
        },
      },
    })
    expect(result.items).toEqual([
      expect.objectContaining({
        bean: expect.objectContaining({
          country: expect.objectContaining({ name: "日本" }),
          name: "Search Blend",
        }),
        id: 9,
        roaster: expect.objectContaining({
          name: "Search Roaster",
        }),
      }),
    ])
    expect(result.pagination.totalPages).toBe(1)
  })

  it("おすすめオファーは好みの味グループに一致するオファーを優先する", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      likes: [
        {
          offer: {
            bean: {
              beanTasteTags: [{ tasteTag: { tasteGroupId: 6n } }],
            },
          },
        },
      ],
      prefectureCode: "13",
      roasterId: null,
      wants: [],
    })
    mockPrisma.offer.findMany.mockResolvedValueOnce([
      {
        _count: { wants: 1 },
        amount: 5,
        bean: {
          acidity: 3,
          beanImages: [],
          beanTasteTags: [{ tasteTag: { id: 8n, name: "raspberry" } }],
          bitterness: 2,
          body: 2,
          country: { id: 5n, name: "エチオピア" },
          croppedAt: null,
          describe: null,
          elevation: null,
          farm: "",
          flavor: 4,
          id: 1n,
          name: "Berry Blend",
          process: "Natural",
          roastLevel: { id: 1n, name: "浅煎り" },
          roaster: {
            id: 3n,
            image: null,
            name: "Berry Roaster",
          },
          roasterId: 3n,
          subregion: "",
          sweetness: 3,
          variety: "",
        },
        beanId: 1n,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        endedAt: new Date("2026-04-20T00:00:00.000Z"),
        id: 99n,
        likes: [],
        price: 1600,
        receiptEndedAt: new Date("2026-04-24T00:00:00.000Z"),
        receiptStartedAt: new Date("2026-04-23T00:00:00.000Z"),
        roastedAt: new Date("2026-04-22T00:00:00.000Z"),
        status: "on_offering",
        wants: [],
        weight: 150,
      },
    ])

    const result = await listRecommendedOffersForUser("7", new Date("2026-04-14T00:00:00.000Z"))

    expect(mockPrisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        where: expect.objectContaining({
          bean: expect.objectContaining({
            beanTasteTags: {
              some: {
                tasteTag: {
                  tasteGroupId: {
                    in: [6n],
                  },
                },
              },
            },
          }),
        }),
      }),
    )
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      bean: expect.objectContaining({
        name: "Berry Blend",
      }),
    })
  })

  it("味の一致が無い場合は同一都道府県のオファーへフォールバックする", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      likes: [],
      prefectureCode: "27",
      roasterId: null,
      wants: [],
    })
    mockPrisma.offer.findMany.mockResolvedValueOnce([
      {
        _count: { wants: 0 },
        amount: 4,
        bean: {
          acidity: 2,
          beanImages: [],
          beanTasteTags: [],
          bitterness: 3,
          body: 3,
          country: { id: 44n, name: "日本" },
          croppedAt: null,
          describe: null,
          elevation: null,
          farm: "",
          flavor: 2,
          id: 2n,
          name: "Near Offer",
          process: "Washed",
          roastLevel: { id: 3n, name: "中煎り" },
          roaster: {
            id: 10n,
            image: null,
            name: "Near Roaster",
          },
          roasterId: 10n,
          subregion: "",
          sweetness: 2,
          variety: "",
        },
        beanId: 2n,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        endedAt: new Date("2026-04-20T00:00:00.000Z"),
        id: 100n,
        likes: [],
        price: 1400,
        receiptEndedAt: new Date("2026-04-24T00:00:00.000Z"),
        receiptStartedAt: new Date("2026-04-23T00:00:00.000Z"),
        roastedAt: new Date("2026-04-22T00:00:00.000Z"),
        status: "on_offering",
        wants: [],
        weight: 150,
      },
    ])

    const result = await listRecommendedOffersForUser("8", new Date("2026-04-14T00:00:00.000Z"))

    expect(mockPrisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        where: expect.objectContaining({
          bean: expect.objectContaining({
            roaster: {
              prefectureCode: "27",
            },
          }),
        }),
      }),
    )
    expect(result[0]).toMatchObject({
      bean: expect.objectContaining({
        name: "Near Offer",
      }),
    })
  })
})
