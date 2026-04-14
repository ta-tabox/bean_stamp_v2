import type { HomeOfferSummary } from "@/features/home/types"
import type { OfferApiResponse } from "@/server/offers"

export function mapOfferToHomeOfferSummary(offer: OfferApiResponse): HomeOfferSummary {
  return {
    acidity: offer.bean.acidity,
    amount: offer.amount,
    beanImageUrl: offer.bean.thumbnail_url,
    beanName: offer.bean.name,
    bitterness: offer.bean.bitterness,
    body: offer.bean.body,
    countryName: offer.bean.country.name,
    createdAt: offer.created_at,
    endedAt: offer.ended_at,
    flavor: offer.bean.flavor,
    id: String(offer.id),
    initialLikeId: offer.like.id ?? null,
    initialWantId: offer.want.id ?? null,
    price: offer.price,
    process: offer.bean.process ?? "未設定",
    receiptEndedAt: offer.receipt_ended_at,
    receiptStartedAt: offer.receipt_started_at,
    roastLevelName: offer.bean.roast_level.name,
    roastedAt: offer.roasted_at,
    roasterId: String(offer.roaster.id),
    roasterImageUrl: offer.roaster.thumbnail_url,
    roasterName: offer.roaster.name,
    status: offer.status,
    sweetness: offer.bean.sweetness,
    tasteNames: offer.bean.taste.names,
    wantsCount: offer.want.count,
    weight: offer.weight,
  }
}
