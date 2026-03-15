import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

// リロード時に値を保持する
const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: sessionStorage, // sessionStorageに保存する
})

export const isSignedInState = atom<boolean>({
  key: 'isSignedIn',
  default: false,
  effects_UNSTABLE: [persistAtom],
})
