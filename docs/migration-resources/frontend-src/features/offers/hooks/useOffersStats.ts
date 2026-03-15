import { useRecoilValue, useSetRecoilState } from 'recoil'

import { offersStatsState } from '@/features/offers/stores/offersStatsState'

// CurrentRoasterが保持しているオファーの統計を保持, on_offering, on_sellingなど
export const useOffersStats = () => {
  const offersStats = useRecoilValue(offersStatsState) // Getterを定義
  const setOffersStats = useSetRecoilState(offersStatsState) // Setter, Updaterを定義

  return { offersStats, setOffersStats }
}
