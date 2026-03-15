import { useRecoilValue, useSetRecoilState } from 'recoil'

import { currentRoasterState } from '@/features/roasters/stores/currentRoasterState'
import { isRoasterState } from '@/features/roasters/stores/isRoasterState'
import type { Roaster } from '@/features/roasters/types'

import type { SetterOrUpdater } from 'recoil'

export const useCurrentRoaster = () => {
  // Recoilでグローバルステートを定義
  const currentRoaster = useRecoilValue(currentRoasterState) // Getterを定義
  const setCurrentRoaster: SetterOrUpdater<Roaster | null> = useSetRecoilState(currentRoasterState) // Setter, Updaterを定義

  // ロースターページかどうかの状態を保持
  const isRoaster = useRecoilValue(isRoasterState)
  const setIsRoaster = useSetRecoilState(isRoasterState)

  return { currentRoaster, setCurrentRoaster, isRoaster, setIsRoaster }
}
