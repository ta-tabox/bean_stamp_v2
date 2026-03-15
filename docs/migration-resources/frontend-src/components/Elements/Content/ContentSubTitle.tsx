import type { FC } from 'react'

type Props = {
  title: string
}

export const ContentSubTitle: FC<Props> = (props) => {
  const { title } = props
  return (
    <div className="w-11/12 mx-auto pt-4 pb-2 bg-gray-50 border-b border-gray-200">
      <h1 className="font-noto font-medium text-xl text-center text-gray-800">{title}</h1>
    </div>
  )
}
