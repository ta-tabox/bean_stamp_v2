import type { FC } from 'react'

import { DetailItem } from '@/components/Elements/Card'
import type { Offer } from '@/features/offers/types'
import { formattedToJaDate } from '@/utils/date'

type Props = {
  offer: Offer
}

export const OfferSchedule: FC<Props> = (props) => {
  const { offer } = props
  const { createdAt, endedAt, roastedAt, receiptEndedAt, receiptStartedAt } = offer

  return (
    <>
      <DetailItem name="オファー作成日" value={formattedToJaDate(createdAt)} />
      <DetailItem name="オファー終了日" value={formattedToJaDate(endedAt)} />
      <DetailItem name="焙煎日" value={formattedToJaDate(roastedAt)} />
      <DetailItem name="受け取り開始日" value={formattedToJaDate(receiptStartedAt)} />
      <DetailItem name="受け取り終了日" value={formattedToJaDate(receiptEndedAt)} />
    </>
  )
}
