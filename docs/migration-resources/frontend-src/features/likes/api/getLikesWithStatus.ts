import type { Like } from '@/features/likes/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
  status: string
}

export const getLikesWithStatus = ({ page, status }: Props) =>
  BackendApiWithAuth.get<Array<Like>>(`/likes?page=${page ?? 1}&search=${status}`)
