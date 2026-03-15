import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}
export const CardContainer: FC<Props> = (props) => {
  const { children } = props
  return <div className="px-6 py-8 mx-auto">{children}</div>
}
