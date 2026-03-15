import type { SendResetMailParams } from '@/features/auth/types'
import { BackendApi } from '@/lib/axios'

type Options = {
  params: SendResetMailParams
}

export const sendResetMail = ({ params }: Options) => BackendApi.post('auth/password', params)
