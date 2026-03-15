import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const ModalText: FC<Props> = (props) => {
  const { children } = props
  return <p className="text-center text-sm sm:text-base text-gray-400">{children}</p>
}
