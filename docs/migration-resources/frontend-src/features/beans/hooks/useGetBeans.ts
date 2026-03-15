import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getBeans as getBeansRequest } from '@/features/beans/api/getBeans'
import type { Bean } from '@/features/beans/types'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetBeans = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [beans, setBeans] = useState<Array<Bean>>([])
  const [loading, setLoading] = useState(false)
  const { setPagination } = usePagination()

  type GetBeans = {
    page: string | null
  }
  const getBeans = ({ page }: GetBeans) => {
    setLoading(true)
    getBeansRequest({ page })
      .then((response) => {
        setBeans(response.data)
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        navigate('/')
        showMessage({ message: 'コーヒー豆が存在しません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { beans, getBeans, loading }
}
