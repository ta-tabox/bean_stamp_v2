import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}
export const Card: FC<Props> = (props) => {
  const { children } = props
  return (
    <div className="container sm:w-11/12 mx-auto py-2 sm:py-4 bg-white md:rounded-lg border border-gray-100 md:shadow-md">
      {children}
    </div>
  )
}
