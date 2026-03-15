import type { Offer } from '@/features/offers'

export type Like = {
  id: number
  userId: number
  offerId: number
  offer: Offer
}
