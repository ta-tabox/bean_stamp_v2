import type { FC } from 'react'

import { Link } from '@/components/Elements/Link'
import type { WantsStats } from '@/features/wants'

type Props = {
  wantsStats: WantsStats | null
}

export const UserAsideNotification: FC<Props> = (props) => {
  const { wantsStats } = props
  return (
    <div className="text-sm">
      {wantsStats && (
        <>
          {wantsStats?.onRoasting === 0 && wantsStats?.notReceipted === 0 && (
            <div className="text-gray-500">お知らせはありません</div>
          )}

          {wantsStats.onRoasting !== 0 && (
            <Link to="/wants?status=on_roasting">{`ロースト期間のウォントが${wantsStats.onRoasting}件あります`}</Link>
          )}
          {wantsStats.notReceipted !== 0 && (
            <Link to="/wants?status=on_selling">{`未受け取りのウォントが${wantsStats.notReceipted}件あります`}</Link>
          )}
        </>
      )}
    </div>
  )
}
