import type { FC } from 'react'
import { useState } from 'react'

import { Hamburger } from '@/components/Elements/Hamburger'
import { DrawerNav } from '@/components/Layout/Nav/DrawerNav'
import { RoasterBottomNav } from '@/components/Layout/Nav/RoasterBottomNav'
import { UserBottomNav } from '@/components/Layout/Nav/UserBottomNav'
import { useSignedInUser } from '@/features/auth'
import { useCurrentRoaster } from '@/features/roasters'

export const BottomNav: FC = () => {
  const { signedInUser } = useSignedInUser()
  const { isRoaster, currentRoaster } = useCurrentRoaster()

  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <nav className="h-14 fixed bottom-0 inset-x-0 z-50 border-t border-bray-200 bg-gray-100">
      {signedInUser && (
        <>
          <div className="h-full px-8 flex items-center justify-between">
            {currentRoaster && (isRoaster ? <RoasterBottomNav roaster={currentRoaster} /> : <UserBottomNav />)}

            {!currentRoaster && <UserBottomNav />}
            <Hamburger toggled={isOpen} toggle={toggleDrawer} />
          </div>
          <DrawerNav user={signedInUser} roaster={currentRoaster} isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
      )}
    </nav>
  )
}
