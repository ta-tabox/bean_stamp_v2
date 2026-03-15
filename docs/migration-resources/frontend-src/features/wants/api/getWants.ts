import type { Want } from '@/features/wants/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
}

export const getWants = ({ page }: Props) => BackendApiWithAuth.get<Array<Want>>(`/wants?page=${page ?? 1}`)
