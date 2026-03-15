import type { User } from '@/features/users'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  page: string | null
}

export const getUsersFollowingToRoaster = ({ id, page }: Options) =>
  BackendApiWithAuth.get<Array<User>>(`roasters/${id}/followers?page=${page ?? 1}`)
