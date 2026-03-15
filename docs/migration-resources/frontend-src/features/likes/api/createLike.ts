import type { Like } from '@/features/likes/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  offerId: number
}

export const createLike = ({ offerId }: Options) => {
  const params = {
    offer_id: offerId,
  }

  return BackendApiWithAuth.post<Like>('likes', params)
}
