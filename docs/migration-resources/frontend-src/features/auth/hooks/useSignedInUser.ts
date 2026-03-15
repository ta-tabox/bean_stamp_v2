import { useRecoilValue, useSetRecoilState } from 'recoil'

import { isBelongingToRoasterState } from '@/features/auth/stores/isBelongingToRoasterState'
import { isSignedInState } from '@/features/auth/stores/isSignedInState'
import { signedInUserState } from '@/features/auth/stores/signedInUserState'
import type { User } from '@/features/users'

import type { SetterOrUpdater } from 'recoil'

export const useSignedInUser = () => {
  // Recoilでグローバルステートを定義
  const signedInUser = useRecoilValue(signedInUserState) // Getterを定義
  const setSignedInUser: SetterOrUpdater<User | null> = useSetRecoilState(signedInUserState) // Setter, Updaterを定義

  // SignInの状態を保持
  const isSignedIn = useRecoilValue(isSignedInState)
  const setIsSignedIn = useSetRecoilState(isSignedInState)

  // ロースターに所属しているかどうかの状態を保持
  const isBelongingToRoaster = useRecoilValue(isBelongingToRoasterState)
  const setIsBelongingToRoaster = useSetRecoilState(isBelongingToRoasterState)

  return { signedInUser, setSignedInUser, isSignedIn, setIsSignedIn, isBelongingToRoaster, setIsBelongingToRoaster }
}
