import type { FC } from 'react'
import { useEffect, memo } from 'react'

import { Copyright } from '@/components/Elements/Copyright'
import { SearchLink } from '@/components/Elements/Link'
import { RoasterAsideNotification } from '@/components/Layout/Aside/RoasterAsideNotification'
import { useGetOffersStats } from '@/features/offers'
import { useCurrentRoaster } from '@/features/roasters'

export const RoasterAsideContent: FC = memo(() => {
  const { offersStats, getOffersStats } = useGetOffersStats()
  const { currentRoaster } = useCurrentRoaster()

  // リロード時にAPIを叩く
  useEffect(() => {
    if (currentRoaster) {
      getOffersStats() // 通知用のオファー統計
    }
  }, [currentRoaster])

  return (
    <div id="roaster-aside" className="min-h-screen flex flex-col items-center">
      <div className="w-44 mt-10">
        <SearchLink type="offer" />
      </div>
      {/* 通知 */}
      <section className="px-6 mt-8 flex flex-col justify-center space-y-1 text-center">
        <h1 className="text-md text-gray-600 e-font">Notification</h1>
        <RoasterAsideNotification offersStats={offersStats} />
      </section>
      <div className="mt-auto mb-4">
        <Copyright />
      </div>
    </div>
  )
})
