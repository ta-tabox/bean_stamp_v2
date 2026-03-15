import { atom } from 'recoil'

import type { Offer } from '@/features/offers/types'

type RecommendedOffersState = Offer[]

// APIから取得したおすすめのオファーのプール
export const recommendedOffersPoolState = atom<RecommendedOffersState>({
  key: 'RecommendedOffersPoolState',
  default: [],
})

// レンダリングに使用するおすすめのオファー
export const recommendedOffersState = atom<RecommendedOffersState>({
  key: 'RecommendedOffersState',
  default: [],
})
