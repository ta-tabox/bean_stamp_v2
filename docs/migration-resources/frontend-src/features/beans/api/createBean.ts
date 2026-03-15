import type { Bean } from '@/features/beans/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  formData: FormData
}

export const createBean = ({ formData }: Options) =>
  BackendApiWithAuth.post<Bean>('beans', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
