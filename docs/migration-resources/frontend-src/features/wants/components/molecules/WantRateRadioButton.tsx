import type { FC } from 'react'

import { WantRateIcon } from '@/features/wants/components/molecules/WantRateIcon'
import type { WantRate } from '@/features/wants/types'

import type { UseFormRegister } from 'react-hook-form'

type Props = {
  value: WantRate
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const WantRateRadioButton: FC<Props> = (props) => {
  const { value, label, register } = props
  return (
    <div className="input-container">
      <input type="radio" id={`rate-${value}`} className="radio-button" value={value} {...register('rate')} />
      <div className="radio-tile">
        <div className="icon">
          <WantRateIcon rate={value} />
        </div>
        <p className="radio-tile-label">{label}</p>
      </div>
    </div>
  )
}
