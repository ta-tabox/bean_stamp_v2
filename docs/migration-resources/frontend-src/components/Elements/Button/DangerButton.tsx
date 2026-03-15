import type { FC, ReactNode } from 'react'
import { memo } from 'react'

import { Spinner } from '@/components/Elements/Spinner'

type Props = {
  children: ReactNode
  sizeClass?: string
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const DangerButton: FC<Props> = memo((props) => {
  const { children, sizeClass = '', disabled = false, loading = false, onClick } = props
  return (
    <button
      type="submit"
      className={`btn bg-rose-500 border-rose-600 text-white hover:bg-rose-600 active:bg-rose-700 ${sizeClass}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner color="text-white" /> : children}
    </button>
  )
})
