import type { OfferApiResponse } from "@/server/offers"

export const offerStatusLabel: Record<OfferApiResponse["status"], string> = {
  end_of_sales: "受け取り終了",
  on_offering: "オファー中",
  on_preparing: "準備中",
  on_roasting: "ロースト期間",
  on_selling: "受け取り期間",
}
