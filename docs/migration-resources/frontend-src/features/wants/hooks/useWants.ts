import { useRecoilValue, useSetRecoilState } from 'recoil'

import { wantsState } from '@/features/wants/stores/wantsState'

export const useWants = () => {
  const wants = useRecoilValue(wantsState) // Getterを定義
  const setWants = useSetRecoilState(wantsState) // Setter, Updaterを定義

  return { wants, setWants }
}
