import type { Offer } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  page: string | null
}

export const getOffersByRoaster = ({ id, page }: Options) =>
  BackendApiWithAuth.get<Array<Offer>>(`roasters/${id}/offers?page=${page ?? 1}`)
