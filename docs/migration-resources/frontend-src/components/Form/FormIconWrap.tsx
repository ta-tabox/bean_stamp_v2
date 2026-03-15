import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const FormIconWrap: FC<Props> = (props) => {
  const { children } = props
  return <div className="absolute left-0 inset-y-0 flex items-center text-gray-400">{children}</div>
}
