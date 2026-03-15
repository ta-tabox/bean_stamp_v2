import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const ContentHeader: FC<Props> = (props) => {
  const { children } = props
  return (
    <header className="lg:sticky top-0 z-40 h-20 pb-2 px-2 mb-4 bg-gray-50 border-b border-gray-200">
      <div className="h-full w-11/12 mx-auto">{children}</div>
    </header>
  )
}
