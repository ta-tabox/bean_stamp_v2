import type { Roaster } from '@/features/roasters'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  page: string | null
}

export const getRoastersFollowedByUser = ({ id, page }: Options) =>
  BackendApiWithAuth.get<Array<Roaster>>(`users/${id}/roasters_followed_by_user?page=${page ?? 1}`)
