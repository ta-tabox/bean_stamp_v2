import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getBean as getBeanRequest } from '@/features/beans/api/getBean'
import type { Bean } from '@/features/beans/types'
import { useMessage } from '@/hooks/useMessage'

export const useGetBean = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const [bean, setBean] = useState<Bean>()

  const getBean = (id: string) => {
    setLoading(true)
    getBeanRequest({ id })
      .then((response) => {
        setBean(response.data)
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'コーヒー豆が存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { bean, getBean, loading }
}
