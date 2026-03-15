import { useState } from 'react'

import type { Offer } from '@/features/offers/types'
import { getOffersByRoaster as getOffersByRoasterRequest } from '@/features/roasters/api/getOffersByRoaster'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetOffersByRoaster = () => {
  const { showMessage } = useMessage()

  const [offersByRoaster, setOffersByRoaster] = useState<Array<Offer>>([])
  const [loading, setLoading] = useState(false)
  const { setPagination } = usePagination()
  type GetOffers = {
    id: string
    page: string | null
  }
  const getOffersByRoaster = ({ id, page }: GetOffers) => {
    setLoading(true)
    getOffersByRoasterRequest({ id, page })
      .then((response) => {
        setOffersByRoaster(response.data)
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        showMessage({ message: 'オファーの取得に失敗しました', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { offersByRoaster, getOffersByRoaster, loading }
}
