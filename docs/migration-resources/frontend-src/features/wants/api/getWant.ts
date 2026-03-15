import type { Want } from '@/features/wants/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const getWant = ({ id }: Options) => BackendApiWithAuth.get<Want>(`/wants/${id}`)
