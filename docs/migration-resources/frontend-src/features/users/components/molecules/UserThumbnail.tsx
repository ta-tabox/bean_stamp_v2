import type { FC } from 'react'

import defaultUserImage from '@/features/users/assets/defaultUser.png'

type Props = {
  name: string
  thumbnailUrl: string | null
}

export const UserThumbnail: FC<Props> = (props) => {
  const { name, thumbnailUrl } = props

  return (
    <img
      className="object-cover w-20 h-20 border-2 border-indigo-500 rounded-full"
      src={`${thumbnailUrl ?? defaultUserImage}`}
      alt={`${name}の画像`}
    />
  )
}
