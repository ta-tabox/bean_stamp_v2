import type { Roaster } from '@/features/roasters/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
  formData: FormData
}

export const updateRoaster = ({ id, formData }: Options) =>
  BackendApiWithAuth.put<Roaster>(`roasters/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
