import type { Want } from '@/features/wants/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  offerId: number
}

export const createWant = ({ offerId }: Options) => {
  const params = {
    offer_id: offerId,
  }

  return BackendApiWithAuth.post<Want>('wants', params)
}
