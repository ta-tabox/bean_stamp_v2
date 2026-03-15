import type { FC } from 'react'

import { Tag } from '@/components/Elements/Tag'

type Props = {
  name: string
}
export const TasteTag: FC<Props> = (props) => {
  const { name } = props
  return <Tag>{name}</Tag>
}
