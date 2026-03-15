import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getRoaster as getRoasterRequest } from '@/features/roasters/api/getRoaster'
import type { Roaster } from '@/features/roasters/types'
import { useMessage } from '@/hooks/useMessage'

export const useGetRoaster = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const [roaster, setRoaster] = useState<Roaster>()

  const getRoaster = useCallback((id: string) => {
    setLoading(true)
    getRoasterRequest({ id })
      .then((response) => {
        setRoaster(response.data)
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'ロースターが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { roaster, getRoaster, loading }
}
