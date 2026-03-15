import { atom, selector } from 'recoil'

import type { WantsStats } from '@/features/wants/types'

type WantsStatsState = WantsStats | null

export const wantsStatsState = atom<WantsStatsState>({
  key: 'wantsStatsState',
  default: null,
})

export const activeWantsStatsState = selector({
  key: 'activeWantsStatsState',
  get: ({ get }) => {
    const wantsStats = get(wantsStatsState)

    let activeWantsStats = 0
    // オファー中、ロースト中、準備中、未受け取りのウォントの集計
    if (wantsStats) {
      activeWantsStats =
        wantsStats.onOffering + wantsStats.onRoasting + wantsStats.onPreparing + wantsStats.notReceipted
    }

    return activeWantsStats
  },
})
