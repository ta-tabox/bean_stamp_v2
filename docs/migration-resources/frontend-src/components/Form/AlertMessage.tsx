import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const AlertMessage: FC<Props> = (props) => {
  const { children } = props
  return (
    <p role="alert" className="text-red-400 pl-4 text-sm">
      *{children}
    </p>
  )
}
