import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const FormMain: FC<Props> = (props) => {
  const { children } = props
  return <div className="bg-gray-100 py-10 px-4 rounded-lg">{children}</div>
}
