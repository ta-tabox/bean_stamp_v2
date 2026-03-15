import type { User } from '@/features/users'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  page: string | null
}

export const getUsersWantedToOffer = ({ id, page }: Options) =>
  BackendApiWithAuth.get<Array<User>>(`offers/${id}/wanted_users?page=${page || 1}`)
