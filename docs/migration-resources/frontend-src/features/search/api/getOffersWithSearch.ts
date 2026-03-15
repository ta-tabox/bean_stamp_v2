import type { Offer } from '@/features/offers'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
  query: string
}

export const getOffersWithSearch = ({ page, query }: Props) =>
  BackendApiWithAuth.get<Array<Offer>>(`/search/offers?${query}&page=${page ?? 1}`)
