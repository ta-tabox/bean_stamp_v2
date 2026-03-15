import { useRecommendedOffers } from '@/features/offers/hooks/useRecommendedOffers'
import { randomSelectFromArray } from '@/utils/randomSelectFromArray'

// signedInUserへおすすめのオファーを3つセレクトする
export const useRandomSelectRecommendedOffers = () => {
  const { recommendedOffersPool, recommendedOffers, setRecommendedOffers } = useRecommendedOffers()
  const randomSelectRecommendedOffers = () => {
    if (recommendedOffersPool.length !== 0) {
      const selectedOffers = randomSelectFromArray({ array: recommendedOffersPool, selectCount: 3 })
      setRecommendedOffers(selectedOffers)
    }
  }
  return { recommendedOffers, randomSelectRecommendedOffers, recommendedOffersPool }
}
