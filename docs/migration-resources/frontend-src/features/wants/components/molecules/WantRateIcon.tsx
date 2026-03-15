import type { FC } from 'react'

import { Bad } from '@/features/wants/components/atoms/Bad'
import { Excellent } from '@/features/wants/components/atoms/Excellent'
import { Good } from '@/features/wants/components/atoms/Good'
import { SoSo } from '@/features/wants/components/atoms/SoSo'
import type { WantRate } from '@/features/wants/types'

type Props = {
  rate: WantRate
}

export const WantRateIcon: FC<Props> = (props) => {
  const { rate } = props
  switch (rate) {
    case 'bad':
      return <Bad />
    case 'so_so':
      return <SoSo />
    case 'good':
      return <Good />
    case 'excellent':
      return <Excellent />
    default:
      return null
  }
}
