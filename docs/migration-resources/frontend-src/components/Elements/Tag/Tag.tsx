import type { FC } from 'react'

type Props = {
  children: string
  backgroundColorClass?: string
  textColorClass?: string
  borderColorClass?: string
}

export const Tag: FC<Props> = (props) => {
  const {
    children,
    backgroundColorClass = 'bg-white',
    textColorClass = 'text-gray-400',
    borderColorClass = 'border-gray-300',
  } = props
  return (
    <div
      className={`border rounded-full text-center px-3 py-1 sm:px-4 text-xs sm:text-sm font-light tracking-tighter sm:tracking-tight capitalize ${backgroundColorClass} ${textColorClass} ${borderColorClass}`}
    >
      {children}
    </div>
  )
}
