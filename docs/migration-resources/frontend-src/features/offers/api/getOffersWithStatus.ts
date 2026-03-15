import type { Offer } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
  status: string
}

// オファーのステータスによる絞り込み用
export const getOffersWithStatus = ({ page, status }: Props) =>
  BackendApiWithAuth.get<Array<Offer>>(`/offers?page=${page ?? 1}&search=${status}`)
