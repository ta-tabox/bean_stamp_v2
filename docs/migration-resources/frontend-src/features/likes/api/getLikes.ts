import type { Like } from '@/features/likes/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
}

export const getLikes = ({ page }: Props) => BackendApiWithAuth.get<Array<Like>>(`/likes?page=${page ?? 1}`)
