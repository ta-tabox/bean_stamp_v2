import type { FC } from 'react'
import { memo } from 'react'

import { TopButton } from '@/components/Elements/Button'
import { StaticNavLink } from '@/components/Elements/Link'
import { useSignedInUser } from '@/features/auth'

export const Header: FC = memo(() => {
  const { isSignedIn } = useSignedInUser()

  return (
    <header className="h-14 border-t border-b z-50 text-black border-gray-200 bg-gray-100 opacity-80 inset-x-0">
      <div className="h-full flex items-center justify-between">
        <div className="pl-2 md:pl-16">
          <TopButton />
        </div>

        <nav className="pr-2 md:pr-12 h-full">
          <ul className="flex h-full items-center md:items-stretch">
            <li className="border-r border-gray-300 md:border-none">
              {isSignedIn ? (
                <StaticNavLink to="/users/home">HOME</StaticNavLink>
              ) : (
                <StaticNavLink to="/">HOME</StaticNavLink>
              )}
            </li>

            <li className="border-r border-gray-300 md:border-none">
              <StaticNavLink to="/about">ABOUT</StaticNavLink>
            </li>
            <li>
              <StaticNavLink to="/help">HELP</StaticNavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
})
