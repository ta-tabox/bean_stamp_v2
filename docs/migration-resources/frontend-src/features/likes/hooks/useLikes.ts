import { useRecoilValue, useSetRecoilState } from 'recoil'

import { likesState } from '@/features/likes/stores/likesState'

export const useLikes = () => {
  const likes = useRecoilValue(likesState) // Getterを定義
  const setLikes = useSetRecoilState(likesState) // Setter, Updaterを定義

  return { likes, setLikes }
}
