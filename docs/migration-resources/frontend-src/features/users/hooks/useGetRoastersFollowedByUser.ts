import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Roaster } from '@/features/roasters'
import { getRoastersFollowedByUser as getRoastersFollowedByUserRequest } from '@/features/users/api/getRoastersFollowedByUser'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetRoastersFollowedByUser = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const { setPagination } = usePagination()
  const [loading, setLoading] = useState(false)
  const [roasters, setRoasters] = useState<Array<Roaster>>()

  type GetRoastersFollowedByUser = {
    id: string
    page: string | null
  }

  const getRoastersFollowedByUser = useCallback(({ id, page }: GetRoastersFollowedByUser) => {
    setLoading(true)
    getRoastersFollowedByUserRequest({ id, page })
      .then((response) => {
        setRoasters(response.data)
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'ユーザーが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { roasters, getRoastersFollowedByUser, loading }
}
