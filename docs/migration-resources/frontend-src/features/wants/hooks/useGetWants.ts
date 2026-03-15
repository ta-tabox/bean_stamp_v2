import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getWants as getWantsRequest } from '@/features/wants/api/getWants'
import { getWantsWithStatus } from '@/features/wants/api/getWantsWithStatus'
import { useWants } from '@/features/wants/hooks/useWants'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetWants = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const { setPagination } = usePagination()

  const { wants, setWants } = useWants()

  type GetWants = {
    page: string | null
    status?: string | null
  }
  const getWants = async ({ page, status }: GetWants) => {
    setLoading(true)
    let response
    try {
      if (status) {
        response = await getWantsWithStatus({ page, status })
      } else {
        response = await getWantsRequest({ page })
      }
    } catch {
      navigate('/')
      showMessage({ message: 'ウォントの取得に失敗しました', type: 'error' })
      return
    } finally {
      setLoading(false)
    }

    setWants(response.data)
    setPagination({ headers: response.headers })
  }

  return { wants, getWants, loading }
}
