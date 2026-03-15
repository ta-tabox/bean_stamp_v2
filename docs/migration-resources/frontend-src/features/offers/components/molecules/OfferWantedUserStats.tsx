import type { FC } from 'react'

import pluralize from 'pluralize'

import { Link } from '@/components/Elements/Link'
import { useCurrentRoaster } from '@/features/roasters'

type Props = {
  offerId: number
  roasterId: number
  count: number
  amount: number
}
export const OfferWantedUserStats: FC<Props> = (props) => {
  const { offerId, roasterId, count, amount } = props
  const { currentRoaster } = useCurrentRoaster()

  return currentRoaster && roasterId === currentRoaster.id ? (
    // 自身のオファーはwanted_usersを見ることができる
    <Link to={`/offers/${offerId}/wanted_users`}>
      <div>{`${pluralize('want', count, true)} / ${amount}`}</div>
    </Link>
  ) : (
    <div className="text-gray-700">{`${pluralize('want', count, true)} / ${amount}`}</div>
  )
}
