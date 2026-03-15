import { useSignedInUser } from '@/features/auth/hooks/useSignedInUser'
import { useLikes } from '@/features/likes'
import { useOffersStats } from '@/features/offers/hooks/useOffersStats'
import { useRecommendedOffers } from '@/features/offers/hooks/useRecommendedOffers'
import { useCurrentRoaster, useUsersFollowingToRoaster } from '@/features/roasters'
import { useWants, useWantsStats } from '@/features/wants'

export const useResetStates = () => {
  const { setIsSignedIn, setSignedInUser, setIsBelongingToRoaster } = useSignedInUser()
  const { setCurrentRoaster, setIsRoaster } = useCurrentRoaster()
  const { setUsersFollowingToRoaster } = useUsersFollowingToRoaster()
  const { setRecommendedOffers, setRecommendedOffersPool } = useRecommendedOffers()
  const { setWants } = useWants()
  const { setWantsStats } = useWantsStats()
  const { setLikes } = useLikes()
  const { setOffersStats } = useOffersStats()

  const resetStates = () => {
    setIsSignedIn(false) // IsSignedInStateを初期化
    setSignedInUser(null) // SignedInUserStateを初期化
    setIsBelongingToRoaster(false) // IsBelongingToRoasterStateを初期化
    setCurrentRoaster(null) // CurrentRoasterStateを初期化
    setIsRoaster(false) // IsRoasterStateを初期化
    setUsersFollowingToRoaster(null) // usersFollowingToRoasterStateの初期化
    setRecommendedOffers([]) // おすすめのオファーを初期化
    setRecommendedOffersPool([]) // おすすめのオファーのプールを初期化
    setWants(null) // wantsStateの初期化
    setWantsStats(null) // サインインユーザーのウォント統計を初期化
    setLikes(null) // likesStateの初期化
    setOffersStats(null) // カレントロースターのオファー統計を初期化
  }

  return { resetStates }
}
