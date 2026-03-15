import type { Want, WantRate } from '@/features/wants/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: number
  rate: WantRate
}

export const patchWantByRate = ({ id, rate }: Options) => {
  const params = {
    rate,
  }

  return BackendApiWithAuth.patch<Want>(`wants/${id}/rate`, params)
}
