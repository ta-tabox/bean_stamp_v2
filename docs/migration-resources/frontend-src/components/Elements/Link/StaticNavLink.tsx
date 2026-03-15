import type { FC } from 'react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  to: string
  children: string
}

export const StaticNavLink: FC<Props> = memo((props) => {
  const { to, children } = props
  return (
    <Link
      to={to}
      className="md:w-20 h-full px-2 flex justify-center items-center text-gray-900 hover:text-white hover:bg-gray-800 e-font"
    >
      {children}
    </Link>
  )
})
