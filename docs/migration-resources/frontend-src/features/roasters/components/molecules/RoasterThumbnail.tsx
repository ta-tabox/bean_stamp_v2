import type { FC } from 'react'

import defaultRoasterImage from '@/features/roasters/assets/defaultRoaster.png'

type Props = {
  name: string
  thumbnailUrl: string | null
}

export const RoasterThumbnail: FC<Props> = (props) => {
  const { name, thumbnailUrl } = props

  return (
    <img
      className="object-cover w-20 h-20 border-2 border-indigo-500 rounded-full"
      src={`${thumbnailUrl ?? defaultRoasterImage}`}
      alt={`${name}の画像`}
    />
  )
}
