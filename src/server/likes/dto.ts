import { buildOfferApiResponse, calculateOfferStatus, type OfferApiResponse } from "@/server/offers"

type OfferDtoInput = Parameters<typeof buildOfferApiResponse>[0]

type LikeDtoInput = {
  id: bigint
  offer: OfferDtoInput
  offerId: bigint
  userId: bigint
}

export type LikeApiResponse = {
  id: number
  offer: OfferApiResponse
  offer_id: number
  user_id: number
}

export function buildLikeApiResponse(input: LikeDtoInput): LikeApiResponse {
  return {
    id: Number(input.id),
    offer: buildOfferApiResponse({
      ...input.offer,
      status: calculateOfferStatus(input.offer),
    }),
    offer_id: Number(input.offerId),
    user_id: Number(input.userId),
  }
}
