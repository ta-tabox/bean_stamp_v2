import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const FormFooter: FC<Props> = (props) => {
  const { children } = props
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center text-sm text-gray-600">{children}</div>
  )
}
