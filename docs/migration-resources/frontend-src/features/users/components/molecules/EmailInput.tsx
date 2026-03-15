import type { FC } from 'react'

import { AlertMessage, FormIconWrap, FormInputWrap, Input } from '@/components/Form'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  disabled?: boolean
}

export const EmailInput: FC<InputProps> = (props) => {
  const { label, register, error, disabled } = props
  return (
    <>
      <FormInputWrap>
        <Input
          label={label}
          type="email"
          placeholder="メールアドレス"
          disabled={disabled}
          register={register}
          required={validation.required}
          pattern={validation.pattern.email}
        />
        <FormIconWrap>
          <svg className="h-7 w-7 p-1 ml-3">
            <use xlinkHref="#mail" />
          </svg>
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
      {error?.types?.pattern && <AlertMessage>{error.types.pattern}</AlertMessage>}
    </>
  )
}
