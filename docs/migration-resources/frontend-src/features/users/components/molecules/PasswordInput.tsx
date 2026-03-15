import type { FC } from 'react'

import { AlertMessage, FormIconWrap, FormInputWrap, Input } from '@/components/Form'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
}

export const PasswordInput: FC<InputProps> = (props) => {
  const { label, register, error } = props
  return (
    <>
      <FormInputWrap>
        <Input
          label={label}
          type="password"
          placeholder="パスワード *6文字以上"
          register={register}
          required={validation.required}
          pattern={validation.pattern.password}
          minLength={validation.minLength(6)}
        />
        <FormIconWrap>
          <svg className="h-7 w-7 p-1 ml-3">
            <use xlinkHref="#unlock" />
          </svg>
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
      {error?.types?.minLength && <AlertMessage>{error.types.minLength}</AlertMessage>}
      {error?.types?.pattern && <AlertMessage>{error.types.pattern}</AlertMessage>}
    </>
  )
}
