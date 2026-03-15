import type { Offer } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const getOffer = ({ id }: Options) => BackendApiWithAuth.get<Offer>(`/offers/${id}`)
