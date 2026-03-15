import type { FC } from 'react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { SecondaryButton } from '@/components/Elements/Button/SecondaryButton'
import { useCurrentRoaster } from '@/features/roasters'

export const TopNavRoasterToggleButton: FC = memo(() => {
  const { isRoaster, setIsRoaster } = useCurrentRoaster()
  const navigate = useNavigate()

  const onClick = () => {
    if (isRoaster) {
      navigate('/users/home')
    } else {
      navigate('/roasters/home')
    }
    setIsRoaster(!isRoaster)
  }
  return (
    <SecondaryButton onClick={onClick}>
      <div className="text-xs flex justify-center">
        <svg className="h-4 w-4 text-gray-600 mr-2">
          <use xlinkHref="#switch-horizontal" />
        </svg>
        {isRoaster ? 'ユーザーへ切り替える' : 'ロースターへ切り替える'}
      </div>
    </SecondaryButton>
  )
})
