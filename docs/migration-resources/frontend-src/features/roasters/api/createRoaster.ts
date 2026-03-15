import type { Roaster } from '@/features/roasters/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  formData: FormData
}

export const createRoaster = ({ formData }: Options) =>
  BackendApiWithAuth.post<Roaster>('roasters', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
