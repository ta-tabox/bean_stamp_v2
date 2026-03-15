import { atom } from 'recoil'

import type { OffersStats } from '@/features/offers/types'

type OffersStatsState = OffersStats | null

export const offersStatsState = atom<OffersStatsState>({
  key: 'offersStatsState',
  default: null,
})
