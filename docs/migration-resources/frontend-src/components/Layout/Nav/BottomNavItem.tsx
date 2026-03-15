import type { FC, ReactNode } from 'react'

import { Badge } from '@/components/Elements/Badge'

type Props = {
  children: ReactNode
  badgeNumber?: number
}
export const BottomNavItem: FC<Props> = (props) => {
  const { children, badgeNumber } = props
  return (
    <div className="text-gray-500 hover:text-gray-800 transition duration-200 cursor-pointer relative">
      {children}
      {badgeNumber && badgeNumber > 0 ? (
        <span className="absolute -top-2 left-4">
          <Badge number={badgeNumber} />
        </span>
      ) : null}
    </div>
  )
}
