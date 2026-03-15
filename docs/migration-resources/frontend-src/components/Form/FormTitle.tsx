import type { FC } from 'react'

type Props = {
  children: string
}

export const FormTitle: FC<Props> = (props) => {
  const { children } = props
  return <h1 className="text-center text-sm text-gray-600 font-light pb-6">{children}</h1>
}
