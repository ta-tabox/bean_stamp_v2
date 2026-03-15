import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getUsersFollowingToRoaster as getUsersFollowingToRoasterRequest } from '@/features/roasters/api/getUsersFollowingToRoaster'
import { useUsersFollowingToRoaster } from '@/features/roasters/hooks/useUsersFollowingToRoaster'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetUsersFollowingToRoaster = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const { usersFollowingToRoaster, setUsersFollowingToRoaster } = useUsersFollowingToRoaster()
  const { setPagination } = usePagination()

  const [loading, setLoading] = useState(false)

  type GetUsersFollowingToRoaster = {
    id: string
    page: string | null
  }

  const getUsersFollowingToRoaster = ({ id, page }: GetUsersFollowingToRoaster) => {
    setLoading(true)
    getUsersFollowingToRoasterRequest({ id, page })
      .then((response) => {
        setUsersFollowingToRoaster(response.data)
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'ロースターが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { usersFollowingToRoaster, getUsersFollowingToRoaster, loading }
}
