import type { FC } from 'react'
import { memo } from 'react'

import { SecondaryButton } from '@/components/Elements/Button/SecondaryButton'
import { Spinner } from '@/components/Elements/Spinner'

type Props = {
  onClick: () => void
  loading: boolean
}

export const LoadingButton: FC<Props> = memo((props) => {
  const { onClick, loading } = props
  return (
    <div className="flex justify-center">
      <SecondaryButton onClick={onClick} sizeClass="w-16">
        <Spinner loading={loading} />
      </SecondaryButton>
    </div>
  )
})
