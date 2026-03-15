import { atom } from 'recoil'

import type { Like } from '@/features/likes/types'

type LikesState = Like[] | null

export const likesState = atom<LikesState>({
  key: 'likesState',
  default: null,
})
