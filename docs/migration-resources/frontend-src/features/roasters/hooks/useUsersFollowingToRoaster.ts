import { useRecoilValue, useSetRecoilState } from 'recoil'

import { usersFollowingToRoasterState } from '@/features/roasters/stores/usersFollowingToRoasterState'

export const useUsersFollowingToRoaster = () => {
  // Getterを定義
  const usersFollowingToRoaster = useRecoilValue(usersFollowingToRoasterState)

  // Setter, Updaterを定義
  const setUsersFollowingToRoaster = useSetRecoilState(usersFollowingToRoasterState)

  return { usersFollowingToRoaster, setUsersFollowingToRoaster }
}
