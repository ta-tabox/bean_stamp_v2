import type { Offer, OfferCreateUpdateData } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  data: OfferCreateUpdateData
}

export const createOffer = ({ data }: Options) => BackendApiWithAuth.post<Offer>('offers', data)
