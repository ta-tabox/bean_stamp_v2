import { useRecoilValue, useSetRecoilState } from 'recoil'

import { activeWantsStatsState, wantsStatsState } from '@/features/wants/stores/wantsStatsState'

export const useWantsStats = () => {
  const wantsStats = useRecoilValue(wantsStatsState) // Getterを定義
  const setWantsStats = useSetRecoilState(wantsStatsState) // Setter, Updaterを定義

  // アクティブなウォントの合計を返す
  const activeWantsStats = useRecoilValue(activeWantsStatsState)

  return { wantsStats, setWantsStats, activeWantsStats }
}
