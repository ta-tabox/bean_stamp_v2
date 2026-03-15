import { getWantsStats as getWantsStatsRequest } from '@/features/wants/api/getWantsStats'
import { useWantsStats } from '@/features/wants/hooks/useWantsStats'
import { useMessage } from '@/hooks/useMessage'

export const useGetWantsStats = () => {
  const { showMessage } = useMessage()
  const { wantsStats, setWantsStats } = useWantsStats()

  const getWantsStats = () => {
    getWantsStatsRequest()
      .then((response) => {
        setWantsStats(response.data)
      })
      .catch(() => {
        showMessage({ message: 'ウォントの集計の取得に失敗しました', type: 'error' })
      })
  }

  return { wantsStats, getWantsStats }
}
