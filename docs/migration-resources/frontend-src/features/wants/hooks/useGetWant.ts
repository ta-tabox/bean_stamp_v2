import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getWant as getWantRequest } from '@/features/wants/api/getWant'
import type { Want } from '@/features/wants/types'
import { useMessage } from '@/hooks/useMessage'

export const useGetWant = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const [want, setWant] = useState<Want>()

  const getWant = (id: string) => {
    setLoading(true)
    getWantRequest({ id })
      .then((response) => {
        setWant(response.data)
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'ウォントが存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { want, getWant, setWant, loading }
}
