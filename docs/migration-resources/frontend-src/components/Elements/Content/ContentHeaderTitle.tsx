import type { FC } from 'react'

type Props = {
  title: string
}

export const ContentHeaderTitle: FC<Props> = (props) => {
  const { title } = props
  return <h1 className="font-noto font-medium text-2xl text-gray-800">{title}</h1>
}
