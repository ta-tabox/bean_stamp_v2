import { useRecoilValue, useSetRecoilState } from 'recoil'

import { recommendedOffersPoolState, recommendedOffersState } from '@/features/offers/stores/recommendedOffersState'

export const useRecommendedOffers = () => {
  // おすすめのオファーのプール
  const recommendedOffersPool = useRecoilValue(recommendedOffersPoolState) // Getter
  const setRecommendedOffersPool = useSetRecoilState(recommendedOffersPoolState) // Setter

  // レンダリングするオファー
  const recommendedOffers = useRecoilValue(recommendedOffersState) // Getterを定義
  const setRecommendedOffers = useSetRecoilState(recommendedOffersState) // Setter, Updaterを定義

  return { recommendedOffers, setRecommendedOffers, recommendedOffersPool, setRecommendedOffersPool }
}
