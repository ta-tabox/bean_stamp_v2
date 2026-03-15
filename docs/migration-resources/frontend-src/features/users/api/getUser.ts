import type { User } from '@/features/users/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const getUser = ({ id }: Options) => BackendApiWithAuth.get<User>(`/users/${id}`)
