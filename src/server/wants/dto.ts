import { OfferStatus, WantRate } from "@prisma/client"

import {
  buildOfferApiResponse,
  calculateOfferStatus,
  type OfferApiResponse,
  type OffersStatsApiResponse,
} from "@/server/offers"

type OfferDtoInput = Parameters<typeof buildOfferApiResponse>[0]

type WantDtoInput = {
  id: bigint
  offer: OfferDtoInput
  offerId: bigint
  rate: WantRate
  receiptedAt: Date | null
  userId: bigint
}

export type WantApiResponse = {
  id: number
  offer: OfferApiResponse
  offer_id: number
  rate: WantRate
  receipted_at: string | null
  user_id: number
}

export type WantsStatsApiResponse = OffersStatsApiResponse & {
  not_receipted: number
}

export function buildWantApiResponse(input: WantDtoInput): WantApiResponse {
  return {
    id: Number(input.id),
    offer: buildOfferApiResponse({
      ...input.offer,
      status: calculateOfferStatus(input.offer),
    }),
    offer_id: Number(input.offerId),
    rate: input.rate,
    receipted_at: input.receiptedAt ? input.receiptedAt.toISOString() : null,
    user_id: Number(input.userId),
  }
}

export function buildWantsStatsApiResponse(input: WantsStatsApiResponse): WantsStatsApiResponse {
  return input
}

export function buildEmptyWantsStats(): WantsStatsApiResponse {
  return {
    end_of_sales: 0,
    not_receipted: 0,
    on_offering: 0,
    on_preparing: 0,
    on_roasting: 0,
    on_selling: 0,
  }
}

export function isActiveWantStatus(status: OfferStatus) {
  return status !== OfferStatus.end_of_sales
}
