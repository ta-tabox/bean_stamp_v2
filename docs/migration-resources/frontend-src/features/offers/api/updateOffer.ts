import type { Offer, OfferCreateUpdateData } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  data: OfferCreateUpdateData
}

export const updateOffer = ({ id, data }: Options) => BackendApiWithAuth.put<Offer>(`offers/${id}`, data)
