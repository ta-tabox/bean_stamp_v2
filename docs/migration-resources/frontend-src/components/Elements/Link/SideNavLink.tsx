import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/Elements/Badge'

type Props = {
  children: ReactNode
  title: string
  to: string
  badgeNumber?: number
}
export const SideNavLink: FC<Props> = (props) => {
  const { children, title, to, badgeNumber } = props
  return (
    <Link to={to}>
      <div className="text-gray-500 hover:text-gray-800 transition duration-200 transform hover:-translate-x-4 group flex items-end inline-block relative">
        {children}
        {badgeNumber && badgeNumber > 0 ? (
          <span className="absolute -bottom-2 left-4">
            <Badge number={badgeNumber} />
          </span>
        ) : null}
        <div className="font-notoserif italic text-gray-500 transition opacity-0 group-hover:opacity-100 ml-1">
          {title}
        </div>
      </div>
    </Link>
  )
}
