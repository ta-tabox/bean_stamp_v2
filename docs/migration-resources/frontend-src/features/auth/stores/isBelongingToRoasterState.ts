import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

// リロード時にも値を保持する
const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: sessionStorage, // sessionStorageに保存する
})

// ユーザーがロースターに所属しているかどうかを保有→ルーティングなどの分岐処理に使用
export const isBelongingToRoasterState = atom<boolean>({
  key: 'isBelongingToRoasterState',
  default: false,
  effects_UNSTABLE: [persistAtom],
})
