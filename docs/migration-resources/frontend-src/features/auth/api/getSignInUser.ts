import type { Roaster } from '@/features/roasters'
import type { User } from '@/features/users'
import { BackendApiWithAuth } from '@/lib/axios'

type CurrentUserResponse = {
  isLogin: boolean
  user: User
  roaster: Roaster | null
}

export const getSignInUser = () => BackendApiWithAuth.get<CurrentUserResponse>('/auth/sessions')
