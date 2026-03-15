import type { FC } from 'react'

import { Tag } from '@/components/Elements/Tag'
import type { OfferStatus } from '@/features/offers/types'

type Props = {
  status: OfferStatus
}

export const OfferStatusTag: FC<Props> = (props) => {
  const { status } = props
  const statusLabels = {
    on_offering: 'オファー中',
    on_roasting: 'ロースト期間',
    on_preparing: '準備中',
    on_selling: '受け取り期間',
    end_of_sales: '受け取り終了',
  }

  const backgroundColors = {
    on_offering: 'bg-blue-500',
    on_roasting: 'bg-green-500',
    on_preparing: 'bg-green-500',
    on_selling: 'bg-red-500',
    end_of_sales: 'bg-gray-700',
  }

  return (
    <div className="font-medium">
      <Tag
        backgroundColorClass={`${backgroundColors[status]}`}
        textColorClass="text-white"
        borderColorClass="border-white"
      >
        {statusLabels[status]}
      </Tag>
    </div>
  )
}
