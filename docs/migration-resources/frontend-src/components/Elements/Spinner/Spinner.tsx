import type { FC } from 'react'
import { memo } from 'react'

type Props = {
  loading?: boolean
  color?: string
}

export const Spinner: FC<Props> = memo((props) => {
  const { loading = true, color = 'text-gray-500' } = props
  return (
    <div className={`mx-auto h-6 w-6 ${loading ? `animate-spin` : ''}`}>
      <svg className={`h-full w-full ${color}`}>
        <use xlinkHref="#arrow-path" />
      </svg>
    </div>
  )
})
