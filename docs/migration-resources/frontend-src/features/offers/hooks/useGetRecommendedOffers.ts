import { useState } from 'react'

import { getRecommendedOffers as getRecommendedOffersRequest } from '@/features/offers/api/getRecommendedOffers'
import { useRecommendedOffers } from '@/features/offers/hooks/useRecommendedOffers'

export const useGetRecommendedOffers = () => {
  const [loading, setLoading] = useState(false)
  const { setRecommendedOffersPool } = useRecommendedOffers()

  // signedInUserへのおすすめのオファーを取得する
  const getRecommendedOffers = () => {
    setLoading(true)
    getRecommendedOffersRequest()
      .then((response) => {
        setRecommendedOffersPool(response.data)
      })
      .catch(() => {
        console.log('recommended offersの取得に失敗しました')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { getRecommendedOffers, loading }
}
