import type { Offer } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  page: string | null
}

export const getCurrentOffers = ({ page }: Options) =>
  BackendApiWithAuth.get<Array<Offer>>(`users/current_offers?page=${page ?? 1}`)
