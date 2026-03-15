import type { Want } from '@/features/wants/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
  status: string
}

export const getWantsWithStatus = ({ page, status }: Props) =>
  BackendApiWithAuth.get<Array<Want>>(`/wants?page=${page ?? 1}&search=${status}`)
