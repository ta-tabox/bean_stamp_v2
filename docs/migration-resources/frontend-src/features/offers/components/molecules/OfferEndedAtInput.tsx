import type { FC } from 'react'

import { AlertMessage, DateInput, FormInputWrap, Label } from '@/components/Form'
import { getNextMonthToday, getToday } from '@/utils/date'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  roastedAt: string
}

export const OfferEndedAtInput: FC<InputProps> = (props) => {
  const { label, register, error, roastedAt } = props

  return (
    <>
      <FormInputWrap>
        <Label label="オファー終了日">
          <DateInput
            label={label}
            register={register}
            required={validation.required}
            min={getToday()}
            max={getNextMonthToday({ next: 1 })}
            shouldBeAfterDate={getToday()}
            shouldBeAfterDateName="本日"
            shouldBeBeforeDate={roastedAt}
            shouldBeBeforeDateName="焙煎日"
          />
        </Label>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
      {error?.types?.shouldBeBeforeDate && <AlertMessage>{error.types.shouldBeBeforeDate}</AlertMessage>}
      {error?.types?.shouldBeAfterDate && <AlertMessage>{error.types.shouldBeAfterDate}</AlertMessage>}
    </>
  )
}
