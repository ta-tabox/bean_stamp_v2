import { atom } from 'recoil'

import type { Roaster } from '@/features/roasters/types'

// signedInUserの所属するroasterを保持する
export const currentRoasterState = atom<Roaster | null>({
  key: 'currentRoasterState',
  default: null,
})
