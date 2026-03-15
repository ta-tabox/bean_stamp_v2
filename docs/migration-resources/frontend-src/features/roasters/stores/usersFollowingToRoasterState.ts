import { atom } from 'recoil'

import type { User } from '@/features/users'

type UsersFollowingToRoasterType = User[] | null

// RoasterのFollower
export const usersFollowingToRoasterState = atom<UsersFollowingToRoasterType>({
  key: 'usersFollowingToRoasterState',
  default: null,
})
