import { atom } from 'recoil'

import type { Want } from '@/features/wants/types'

type WantsState = Want[] | null

export const wantsState = atom<WantsState>({
  key: 'wantsState',
  default: null,
})
