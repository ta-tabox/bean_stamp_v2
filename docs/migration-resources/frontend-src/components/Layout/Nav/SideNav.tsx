import type { FC } from 'react'
import { memo } from 'react'

import { SideNavRoasterToggleButton, TopButton } from '@/components/Elements/Button'
import { Link } from '@/components/Elements/Link'
import { RoasterSideNav } from '@/components/Layout/Nav/RoasterSideNav'
import { UserSideNav } from '@/components/Layout/Nav/UserSideNav'
import { useSignedInUser } from '@/features/auth/hooks/useSignedInUser'
import { useCurrentRoaster } from '@/features/roasters'

export const SideNav: FC = memo(() => {
  const { signedInUser } = useSignedInUser()
  const { isRoaster, currentRoaster } = useCurrentRoaster()

  return (
    <nav className="h-full w-28">
      {signedInUser && (
        <div className="min-h-screen w-full sticky flex flex-col justify-between items-center top-0 border-r border-gray-200">
          {/* TOPアイコン */}
          <div className="mx-4 mt-12 pb-8">
            <TopButton />
          </div>
          <div className="w-12 mx-auto">
            <hr className="border-gray-200" />
          </div>
          {/* ナビアイコン */}
          <div className="ml-14">
            {currentRoaster &&
              (isRoaster ? <RoasterSideNav roaster={currentRoaster} /> : <UserSideNav user={signedInUser} />)}

            {!currentRoaster && <UserSideNav user={signedInUser} />}
          </div>
          <div className="w-12 mx-auto">
            <hr className="border-gray-200" />
          </div>

          {/* Roaster 切り替え */}
          <div className="mb-8">
            {currentRoaster ? (
              <SideNavRoasterToggleButton user={signedInUser} roaster={currentRoaster} />
            ) : (
              <div className="h-20 w-20 text-sm text-center">
                <p className="text-xs">ロースターを</p>
                <Link to="/roasters/new">登録する</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
})
