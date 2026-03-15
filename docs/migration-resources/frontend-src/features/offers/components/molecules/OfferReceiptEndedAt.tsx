import type { FC } from 'react'

import { AlertMessage, DateInput, FormInputWrap, Label } from '@/components/Form'
import { getNextMonthToday, getToday } from '@/utils/date'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type Props = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  receiptStartedAt: string
}

export const OfferReceiptEndedAtInput: FC<Props> = (props) => {
  const { label, register, error, receiptStartedAt } = props
  return (
    <>
      <FormInputWrap>
        <Label label="受け取り終了日">
          <DateInput
            label={label}
            register={register}
            required={validation.required}
            min={getToday()}
            max={getNextMonthToday({ next: 2 })}
            shouldBeAfterDate={receiptStartedAt}
            shouldBeAfterDateName="受け取り開始日"
            shouldBeBeforeDate={getNextMonthToday({ next: 3 })} // maxで入力値制限するため不使用
            shouldBeBeforeDateName=""
          />
        </Label>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
      {error?.types?.shouldBeBeforeDate && <AlertMessage>{error.types.shouldBeBeforeDate}</AlertMessage>}
      {error?.types?.shouldBeAfterDate && <AlertMessage>{error.types.shouldBeAfterDate}</AlertMessage>}
    </>
  )
}
