import { describe, expect, it } from "vitest"

import { buildOfferApiResponse } from "@/server/offers"

describe("offer dto builders", () => {
  it("Offer DTO を旧 API 互換の形へ変換する", () => {
    expect(
      buildOfferApiResponse({
        _count: {
          wants: 5,
        },
        amount: 20,
        bean: {
          acidity: 4,
          beanImages: [
            { image: "https://example.com/bean-1.jpg" },
            { image: "https://example.com/bean-2.jpg" },
          ],
          beanTasteTags: [
            { tasteTag: { id: 0n, name: "選択されていません" } },
            { tasteTag: { id: 5n, name: "jasmine" } },
            { tasteTag: { id: 24n, name: "orange" } },
          ],
          bitterness: 2,
          body: 3,
          country: {
            id: 44n,
            name: "日本",
          },
          croppedAt: new Date("2026-03-01T00:00:00.000Z"),
          describe: "華やかな豆です",
          elevation: 1450,
          farm: "Sun Farm",
          flavor: 5,
          id: 10n,
          name: "Spring Blend",
          process: "Washed",
          roastLevel: {
            id: 2n,
            name: "中浅煎り",
          },
          roaster: {
            id: 3n,
            image: "https://example.com/roaster.jpg",
            name: "Roaster House",
          },
          roasterId: 3n,
          subregion: "Tokyo",
          sweetness: 4,
          variety: "Geisha",
        },
        beanId: 10n,
        createdAt: new Date("2026-04-10T12:30:00.000Z"),
        endedAt: new Date("2026-04-14T00:00:00.000Z"),
        id: 9n,
        likes: [{ id: 91n }],
        price: 1800,
        receiptEndedAt: new Date("2026-04-18T00:00:00.000Z"),
        receiptStartedAt: new Date("2026-04-17T00:00:00.000Z"),
        roastedAt: new Date("2026-04-15T00:00:00.000Z"),
        wants: [{ id: 42n }],
        weight: 200,
      }),
    ).toEqual({
      amount: 20,
      bean: {
        acidity: 4,
        bitterness: 2,
        body: 3,
        country: {
          id: 44,
          name: "日本",
        },
        cropped_at: "2026-03",
        describe: "華やかな豆です",
        elevation: 1450,
        farm: "Sun Farm",
        flavor: 5,
        id: 10,
        image_urls: [
          "https://example.com/bean-1.jpg",
          "https://example.com/bean-2.jpg",
        ],
        name: "Spring Blend",
        process: "Washed",
        roast_level: {
          id: 2,
          name: "中浅煎り",
        },
        roaster_id: 3,
        subregion: "Tokyo",
        sweetness: 4,
        taste: {
          ids: [5, 24],
          names: ["jasmine", "orange"],
        },
        thumbnail_url: "https://example.com/bean-1.jpg",
        variety: "Geisha",
      },
      bean_id: 10,
      created_at: "2026-04-10",
      ended_at: "2026-04-14",
      id: 9,
      like: {
        id: 91,
        is_liked: true,
      },
      price: 1800,
      receipt_ended_at: "2026-04-18",
      receipt_started_at: "2026-04-17",
      roasted_at: "2026-04-15",
      roaster: {
        id: 3,
        name: "Roaster House",
        thumbnail_url: "https://example.com/roaster.jpg",
      },
      status: "on_offering",
      want: {
        count: 5,
        id: 42,
        is_wanted: true,
      },
      weight: 200,
    })
  })
})
