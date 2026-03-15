import type { FC } from 'react'

import { AlertMessage, DateInput, FormInputWrap, Label } from '@/components/Form'
import { getNextMonthToday, getToday } from '@/utils/date'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  endedAt: string
  receiptStartedAt: string
}

export const OfferRoastedAtInput: FC<InputProps> = (props) => {
  const { label, register, error, endedAt, receiptStartedAt } = props
  return (
    <>
      <FormInputWrap>
        <Label label="焙煎日">
          <DateInput
            label={label}
            register={register}
            required={validation.required}
            min={getToday()}
            max={getNextMonthToday({ next: 1 })}
            shouldBeAfterDate={endedAt}
            shouldBeAfterDateName="オファー終了日"
            shouldBeBeforeDate={receiptStartedAt}
            shouldBeBeforeDateName="受け取り開始日"
          />
        </Label>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
      {error?.types?.shouldBeBeforeDate && <AlertMessage>{error.types.shouldBeBeforeDate}</AlertMessage>}
      {error?.types?.shouldBeAfterDate && <AlertMessage>{error.types.shouldBeAfterDate}</AlertMessage>}
    </>
  )
}
