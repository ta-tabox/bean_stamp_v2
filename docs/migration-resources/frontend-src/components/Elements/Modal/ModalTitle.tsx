import type { FC } from 'react'

type Props = {
  children: string
}

export const ModalTitle: FC<Props> = (props) => {
  const { children } = props
  return <h1 className="text-center text-base sm:text-lg text-gray-600 font-light pb-6">{children}</h1>
}
