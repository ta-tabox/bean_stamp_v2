import { describe, expect, it } from "vitest"

import { buildBeanApiResponse } from "@/server/beans"

describe("bean dto builders", () => {
  it("Bean DTO を旧 API 互換の形へ変換する", () => {
    expect(
      buildBeanApiResponse({
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
        roasterId: 3n,
        subregion: "Tokyo",
        sweetness: 4,
        variety: "Geisha",
      }),
    ).toEqual({
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
    })
  })
})
