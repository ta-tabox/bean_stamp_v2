import type { FC } from 'react'

import { AlertMessage, FormIconWrap, FormInputWrap, Input } from '@/components/Form'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
}

export const OfferAmountInput: FC<InputProps> = (props) => {
  const { label, register, error } = props
  return (
    <>
      <FormInputWrap>
        <Input
          label={label}
          type="number"
          placeholder="数量（個）"
          register={register}
          min={validation.min(1)}
          required={validation.required}
        />
        <FormIconWrap>
          <i className="fa-solid fa-cubes fa-lg ml-3 p-1" />
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.min && <AlertMessage>{error.types.min}</AlertMessage>}
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
    </>
  )
}
