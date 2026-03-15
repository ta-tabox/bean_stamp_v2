import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOffer as getOfferRequest } from '@/features/offers/api/getOffer'
import type { Offer } from '@/features/offers/types'
import { useMessage } from '@/hooks/useMessage'

export const useGetOffer = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const [offer, setOffer] = useState<Offer>()

  const getOffer = (id: string) => {
    setLoading(true)
    getOfferRequest({ id })
      .then((response) => {
        setOffer(response.data)
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'オファーが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { offer, getOffer, setOffer, loading }
}
