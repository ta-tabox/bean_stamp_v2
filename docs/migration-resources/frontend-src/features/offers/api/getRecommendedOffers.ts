import type { Offer } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

export const getRecommendedOffers = () => BackendApiWithAuth.get<Array<Offer>>(`/offers/recommend`)
