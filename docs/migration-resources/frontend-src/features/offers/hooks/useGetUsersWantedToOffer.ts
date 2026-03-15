import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getUsersWantedToOffer as getUsersWantedToOfferRequest } from '@/features/offers/api/getUsersWantedToOffer'
import type { User } from '@/features/users'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetUsersWantedToOffer = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const [usersWantedToOffer, setUsersWantedToOffer] = useState<Array<User>>([])
  const { setPagination } = usePagination()

  const [loading, setLoading] = useState(false)

  type GetUsersWantedToOffer = {
    id: string
    page: string | null
  }

  const getUsersWantedToOffer = ({ id, page }: GetUsersWantedToOffer) => {
    setLoading(true)
    getUsersWantedToOfferRequest({ id, page })
      .then((response) => {
        setUsersWantedToOffer(response.data)
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'オファーが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { usersWantedToOffer, getUsersWantedToOffer, loading }
}
