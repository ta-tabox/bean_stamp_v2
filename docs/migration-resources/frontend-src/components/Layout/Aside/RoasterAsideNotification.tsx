import type { FC } from 'react'

import { Link } from '@/components/Elements/Link'
import type { OffersStats } from '@/features/offers'

type Props = {
  offersStats: OffersStats | null
}

export const RoasterAsideNotification: FC<Props> = (props) => {
  const { offersStats } = props
  return (
    <div className="text-sm">
      {offersStats && (
        <>
          {offersStats?.onRoasting === 0 && offersStats?.onSelling === 0 && (
            <div className="text-gray-500">お知らせはありません</div>
          )}

          {offersStats.onRoasting !== 0 && (
            <Link to="/offers?status=on_roasting">{`ロースト期間のオファーが${offersStats.onRoasting}件あります`}</Link>
          )}
          {offersStats.onSelling !== 0 && (
            <Link to="/offers?status=on_selling">{`受け取り期間のオファーが${offersStats.onSelling}件あります`}</Link>
          )}
        </>
      )}
    </div>
  )
}
