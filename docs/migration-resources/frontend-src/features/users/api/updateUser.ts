import type { UserResponse } from '@/features/auth/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  formData: FormData
}

export const updateUser = ({ formData }: Options) =>
  BackendApiWithAuth.patch<UserResponse>('auth', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
