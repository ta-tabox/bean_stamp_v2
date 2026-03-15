import type { FC } from 'react'

import defaultRoasterImage from '@/features/roasters/assets/defaultRoaster.png'
import type { Roaster } from '@/features/roasters/types'

type Props = {
  roaster: Roaster
}

export const RoasterImage: FC<Props> = (props) => {
  const { roaster } = props

  const imageUrl = roaster.imageUrl ? `${roaster.imageUrl}` : defaultRoasterImage

  return (
    <img
      src={imageUrl}
      alt={`${roaster.name}の画像`}
      className="object-cover object-center w-full h-48 lg:h-64 rounded-md shadow"
    />
  )
}
