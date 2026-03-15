import { getSignInUser } from '@/features/auth/api/getSignInUser'
import { useAuthCookies } from '@/features/auth/hooks/useAuthCookies'
import { useResetStates } from '@/features/auth/hooks/useResetStates'
import { useSignedInUser } from '@/features/auth/hooks/useSignedInUser'
import { useCurrentRoaster } from '@/features/roasters'

export const useLoadUser = () => {
  const { setIsSignedIn, setSignedInUser, setIsBelongingToRoaster } = useSignedInUser()
  const { setCurrentRoaster } = useCurrentRoaster()
  const { removeAuthCookies } = useAuthCookies()
  const { resetStates } = useResetStates()

  // サインインユーザーの読み込み
  const loadUser = async (): Promise<void> => {
    await getSignInUser()
      .then((res) => {
        if (!res.data.isLogin) {
          removeAuthCookies()
          resetStates()
          return
        }

        setIsSignedIn(true)
        setSignedInUser(res.data.user)

        if (res.data.roaster) {
          setIsBelongingToRoaster(true)
          setCurrentRoaster(res.data.roaster)
        } else {
          setIsBelongingToRoaster(false)
          setCurrentRoaster(null)
        }
      })
      .catch(() => {
        removeAuthCookies()
        resetStates()
      })
  }
  return { loadUser }
}
