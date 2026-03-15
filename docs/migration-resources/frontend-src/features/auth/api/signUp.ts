import type { SignUpParams, UserResponse } from '@/features/auth/types'
import { BackendApi } from '@/lib/axios'

type Options = {
  params: SignUpParams
}

export const signUpWithSignUpParams = ({ params }: Options) => BackendApi.post<UserResponse>('auth', params)
