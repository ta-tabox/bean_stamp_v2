import type { FC, ReactNode } from 'react'
import { memo } from 'react'

import { Spinner } from '@/components/Elements/Spinner'

type Props = {
  children: ReactNode
  sizeClass?: string
  isButton?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const PrimaryButton: FC<Props> = memo((props) => {
  const { children, sizeClass = '', isButton = false, disabled = false, loading = false, onClick } = props
  return (
    <button
      type={isButton ? 'button' : 'submit'}
      className={`btn bg-indigo-500 border-indigo-600 text-white hover:bg-indigo-600 active:bg-indigo-700 ${sizeClass}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner color="text-white" /> : children}
    </button>
  )
})
