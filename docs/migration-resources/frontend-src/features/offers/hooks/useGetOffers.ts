import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOffers as getOffersRequest } from '@/features/offers/api/getOffers'
import { getOffersWithStatus } from '@/features/offers/api/getOffersWithStatus'
import type { Offer } from '@/features/offers/types'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetOffers = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [offers, setOffers] = useState<Array<Offer>>([])
  const [loading, setLoading] = useState(false)
  const { setPagination } = usePagination()

  type GetOffers = {
    page: string | null
    status?: string | null
  }
  const getOffers = async ({ page, status }: GetOffers) => {
    setLoading(true)
    let response
    try {
      if (status) {
        response = await getOffersWithStatus({ page, status }) // statusの指定があった場合は、statusで絞り込み
      } else {
        response = await getOffersRequest({ page }) // statusがない場合そのまま取得
      }
    } catch {
      navigate('/')
      showMessage({ message: 'オファーの取得に失敗しました', type: 'error' })
      return
    } finally {
      setLoading(false)
    }

    setOffers(response.data)
    setPagination({ headers: response.headers })
  }

  return { offers, getOffers, loading }
}
