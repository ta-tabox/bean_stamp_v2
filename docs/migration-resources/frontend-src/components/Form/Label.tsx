import type { FC, ReactElement } from 'react'

type Props = {
  label: string
  children: ReactElement
}

export const Label: FC<Props> = (props) => {
  const { label, children } = props

  return (
    <label className="text-gray-500 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}
