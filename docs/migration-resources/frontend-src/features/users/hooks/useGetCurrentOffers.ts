import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Offer } from '@/features/offers/types'
import { getCurrentOffers as getCurrentOffersRequest } from '@/features/users/api/getCurrentOffers'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetCurrentOffers = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState<Array<Offer>>()
  const { setPagination } = usePagination()

  type GetCurrentOffers = {
    page: string | null
  }

  const getCurrentOffers = ({ page }: GetCurrentOffers) => {
    setLoading(true)
    getCurrentOffersRequest({ page })
      .then((response) => {
        setOffers(response.data)
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'オファーの取得に失敗しました', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { currentOffers: offers, getCurrentOffers, loading }
}
