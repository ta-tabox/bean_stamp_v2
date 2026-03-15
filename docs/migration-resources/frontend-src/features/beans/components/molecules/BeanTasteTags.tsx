import type { FC } from 'react'

import { TasteTag } from '@/features/beans/components/atoms/TasteTag'

type Props = {
  tastes: string[]
}
export const BeanTasteTags: FC<Props> = (props) => {
  const { tastes } = props
  return (
    <div className="flex justify-center items-center space-x-1">
      {tastes.map((taste) => (
        <TasteTag key={taste} name={taste} />
      ))}
    </div>
  )
}
