import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { User } from '@/features/users'
import { getUser as getUserRequest } from '@/features/users/api/getUser'
import { useMessage } from '@/hooks/useMessage'

export const useGetUser = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User>()

  const getUser = useCallback((id: string) => {
    setLoading(true)
    getUserRequest({ id })
      .then((response) => {
        setUser(response.data)
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'ユーザーが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { user, getUser, loading }
}
