import type { FC } from 'react'
import { memo } from 'react'

import { TopButton, TopNavRoasterToggleButton } from '@/components/Elements/Button'
import { Link } from '@/components/Elements/Link'
import { useCurrentRoaster } from '@/features/roasters'

export const TopNav: FC = memo(() => {
  const { currentRoaster } = useCurrentRoaster()
  return (
    <nav className="h-14 fixed top-0 inset-x-0 z-40 border-b border-gray-200 bg-gray-100">
      <div className="h-full flex items-center justify-between">
        <div className="pl-4">
          <TopButton />
        </div>
        {/* Roaster 切り替え */}
        <div className="mr-4">
          {currentRoaster ? (
            <TopNavRoasterToggleButton />
          ) : (
            <div className="text-sm text-center">
              <p>
                ロースターを
                <span>
                  <Link to="/roasters/new">登録する</Link>
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
})
