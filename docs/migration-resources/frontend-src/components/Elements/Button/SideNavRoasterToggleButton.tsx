import type { FC } from 'react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Roaster } from '@/features/roasters'
import { useCurrentRoaster } from '@/features/roasters'
import defaultRoasterImage from '@/features/roasters/assets/defaultRoaster.png'
import type { User } from '@/features/users'
import defaultUserImage from '@/features/users/assets/defaultUser.png'

type Props = {
  user: User
  roaster: Roaster
}

export const SideNavRoasterToggleButton: FC<Props> = memo((props) => {
  const { user, roaster } = props
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

  const userImageUrl = user.imageUrl ? `${user.imageUrl}` : defaultUserImage
  const roasterImageUrl = roaster.imageUrl ? `${roaster.imageUrl}` : defaultRoasterImage

  return (
    <div className="text-center">
      <button type="submit" onClick={onClick}>
        <img
          src={isRoaster ? userImageUrl : roasterImageUrl}
          alt={`${isRoaster ? user.name : roaster.name}のホームへのリンクの画像`}
          className="object-cover w-20 h-20 rounded-full border-2 border-indigo-500"
        />
      </button>
      <div className="mx-auto font-light text-xs">
        {isRoaster ? (
          <p>
            ユーザーへ
            <br />
            切り替える
          </p>
        ) : (
          <p>
            ロースターへ
            <br />
            切り替える
          </p>
        )}
      </div>
    </div>
  )
})
