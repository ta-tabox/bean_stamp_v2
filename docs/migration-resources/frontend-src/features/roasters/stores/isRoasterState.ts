import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

// リロード時にも値を保持する
const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: sessionStorage, // sessionStorageに保存する
})

// ロースター用ページ切り替えに使用
export const isRoasterState = atom<boolean>({
  key: 'isRoasterState',
  default: false,
  effects_UNSTABLE: [persistAtom],
})
