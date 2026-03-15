import type { OffersStats } from '@/features/offers/types'
import { BackendApiWithAuth } from '@/lib/axios'

export const getOffersStats = () => BackendApiWithAuth.get<OffersStats>('offers/stats')
