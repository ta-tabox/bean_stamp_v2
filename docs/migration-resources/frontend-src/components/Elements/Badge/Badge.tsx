import type { FC } from 'react'

type Props = {
  number: number
}

export const Badge: FC<Props> = (props) => {
  const { number } = props
  return (
    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-thin leading-none text-red-100 bg-red-500 rounded-full">
      {/* 100以上は99+と表示 */}
      {number <= 99 ? number : '99+'}
    </span>
  )
}
