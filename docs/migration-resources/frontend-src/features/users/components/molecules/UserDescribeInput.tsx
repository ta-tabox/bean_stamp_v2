import type { FC } from 'react'

import { AlertMessage, FormIconWrap, FormInputWrap, TextAreaInput } from '@/components/Form'
import { validation } from '@/utils/validation'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
}

export const UserDescribeInput: FC<InputProps> = (props) => {
  const { label, register, error } = props
  return (
    <>
      <FormInputWrap>
        <TextAreaInput
          label={label}
          placeholder="自己紹介(140文字まで)"
          register={register}
          rows={5}
          maxLength={validation.maxLength(140)}
        />
        <FormIconWrap>
          <svg className="h-7 w-7 p-1 ml-3">
            <use xlinkHref="#pencil" />
          </svg>
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.maxLength && <AlertMessage>{error.types.maxLength}</AlertMessage>}
    </>
  )
}
