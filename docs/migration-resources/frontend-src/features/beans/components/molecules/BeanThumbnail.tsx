import type { FC } from 'react'

import defaultBeanImage from '@/features/beans/assets/defaultBean.png'

type Props = {
  name: string
  thumbnailUrl: string | null
}

export const BeanThumbnail: FC<Props> = (props) => {
  const { name, thumbnailUrl } = props

  return (
    <img
      className="object-cover w-20 h-20 border-2 border-indigo-500 rounded-full"
      src={`${thumbnailUrl ?? defaultBeanImage}`}
      alt={`${name}の画像`}
    />
  )
}
