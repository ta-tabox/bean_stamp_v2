import type { FC } from 'react'

import { Tag } from '@/components/Elements/Tag'

type Props = {
  isReceipted: boolean
}

export const WantReceiptedTag: FC<Props> = (props) => {
  const { isReceipted } = props

  return (
    <div className="font-medium">
      <Tag
        backgroundColorClass={isReceipted ? 'bg-gray-700' : 'bg-indigo-500'}
        textColorClass="text-white"
        borderColorClass="border-white"
      >
        {isReceipted ? '受け取り済み' : '未受け取り'}
      </Tag>
    </div>
  )
}
