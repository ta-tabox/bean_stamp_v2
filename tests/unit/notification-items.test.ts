import { describe, expect, it } from "vitest"

import { buildNotificationItems } from "@/components/layout/notification-items"

describe("notification items", () => {
  it("ユーザーモードでは wants stats から通知リンクを組み立てる", () => {
    expect(
      buildNotificationItems({
        mode: "user",
        wantsStats: {
          end_of_sales: 0,
          not_receipted: 1,
          on_offering: 3,
          on_preparing: 0,
          on_roasting: 2,
          on_selling: 1,
        },
      }),
    ).toEqual([
      {
        href: "/wants?status=on_roasting",
        text: "ロースト期間のウォントが2件あります",
      },
      {
        href: "/wants?status=on_selling",
        text: "未受け取りのウォントが1件あります",
      },
    ])
  })

  it("ロースターモードでは offers stats から通知リンクを組み立てる", () => {
    expect(
      buildNotificationItems({
        mode: "roaster",
        offersStats: {
          end_of_sales: 0,
          on_offering: 1,
          on_preparing: 0,
          on_roasting: 2,
          on_selling: 3,
        },
      }),
    ).toEqual([
      {
        href: "/offers?status=on_roasting",
        text: "ロースト期間のオファーが2件あります",
      },
      {
        href: "/offers?status=on_selling",
        text: "受け取り期間のオファーが3件あります",
      },
    ])
  })
})
