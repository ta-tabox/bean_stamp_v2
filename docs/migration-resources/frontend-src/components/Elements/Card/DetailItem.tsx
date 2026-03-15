import type { FC } from 'react'

type Props = {
  name: string
  value?: string | number | null
  customClass?: string
}

export const DetailItem: FC<Props> = (props) => {
  const { name, value, customClass } = props

  return (
    <div className={`w-11/12 mx-auto flex border-t border-gray-200 py-2 ${customClass ?? ''}`}>
      <span className="text-gray-500">{name}</span>
      <span className="ml-auto text-gray-800">{value}</span>
    </div>
  )
}
