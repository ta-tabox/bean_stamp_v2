import type { SignInParams, UserResponse } from '@/features/auth/types'
import { BackendApi } from '@/lib/axios'

type Options = {
  params: SignInParams
}

export const signInWithEmailAndPassword = ({ params }: Options) => BackendApi.post<UserResponse>('auth/sign_in', params)
