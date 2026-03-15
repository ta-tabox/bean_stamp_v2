import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const FormInputWrap: FC<Props> = (props) => {
  const { children } = props
  return <div className="relative mt-3">{children}</div>
}
