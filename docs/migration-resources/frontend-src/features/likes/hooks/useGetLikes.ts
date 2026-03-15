import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getLikes as getLikesRequest } from '@/features/likes/api/getLikes'
import { getLikesWithStatus } from '@/features/likes/api/getLikesWithStatus'
import { useLikes } from '@/features/likes/hooks/useLikes'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const useGetLikes = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)
  const { setPagination } = usePagination()

  const { likes, setLikes } = useLikes()

  type GetLikes = {
    page: string | null
    status?: string | null
  }
  const getLikes = async ({ page, status }: GetLikes) => {
    setLoading(true)
    let response
    try {
      if (status) {
        response = await getLikesWithStatus({ page, status }) // statusがある場合はstatusで絞り込んで取得
      } else {
        response = await getLikesRequest({ page }) // statusがない場合はそのまま取得
      }
    } catch {
      navigate('/')
      showMessage({ message: 'お気に入りの取得に失敗しました', type: 'error' })
      return
    } finally {
      setLoading(false)
    }
    setLikes(response.data)
    setPagination({ headers: response.headers })
  }

  return { likes, getLikes, setLikes, loading }
}
