import type { Bean } from '@/features/beans/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  formData: FormData
}

export const updateBean = ({ id, formData }: Options) =>
  BackendApiWithAuth.put<Bean>(`beans/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
