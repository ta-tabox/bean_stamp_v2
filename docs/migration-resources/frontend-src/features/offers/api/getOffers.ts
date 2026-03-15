import type { Offer } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
}

export const getOffers = ({ page }: Props) => BackendApiWithAuth.get<Array<Offer>>(`/offers?page=${page ?? 1}`)
