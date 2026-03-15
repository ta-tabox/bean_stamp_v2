import type { FC, ReactNode } from 'react'
import { memo } from 'react'

import { Spinner } from '@/components/Elements/Spinner'

type Props = {
  children: ReactNode
  sizeClass?: string
  isButton?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export const SecondaryButton: FC<Props> = memo((props) => {
  const { children, sizeClass = '', isButton = false, disabled = false, loading = false, onClick } = props
  return (
    <button
      type={isButton ? 'button' : 'submit'}
      className={`btn bg-white border-gray-200 text-gray-600 hover:bg-gray-100 active:bg-gray-200 ${sizeClass}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
})
