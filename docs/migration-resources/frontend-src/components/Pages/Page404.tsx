import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@/components/Elements/Button'
import { Head } from '@/components/Head'
import { useCurrentRoaster } from '@/features/roasters'

export const Page404: FC = () => {
  const navigate = useNavigate()
  const { isRoaster } = useCurrentRoaster()

  const onClickHome = () => {
    if (isRoaster) {
      navigate('/roasters/home')
    } else {
      navigate('/users/home')
    }
  }

  return (
    <>
      <Head title="Not Found" />
      <div className="relative flex items-start justify-center min-h-screen bg-gray-100 dark:bg-gray-900 items-center">
        <div className="max-w-xl mx-auto flex flex-col justify-center space-y-4">
          <div className="flex items-center">
            <div className="px-4 text-lg text-gray-500 border-r border-gray-400 tracking-wider">404 </div>
            <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">Not Found </div>
          </div>
          <PrimaryButton onClick={onClickHome}>GO TO HOME</PrimaryButton>
        </div>
      </div>
    </>
  )
}
