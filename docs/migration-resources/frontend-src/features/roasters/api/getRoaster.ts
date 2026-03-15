import type { Roaster } from '@/features/roasters/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const getRoaster = ({ id }: Options) => BackendApiWithAuth.get<Roaster>(`/roasters/${id}`)
