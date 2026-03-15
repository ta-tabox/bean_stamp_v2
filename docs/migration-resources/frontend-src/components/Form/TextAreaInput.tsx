import type { FC } from 'react'

import type { UseFormRegister, Validate, ValidationRule } from 'react-hook-form'

type Props = {
  label: string
  disabled?: boolean
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  placeholder?: string
  rows?: number
  required?: string | ValidationRule<boolean>
  minLength?: ValidationRule<number>
  maxLength?: ValidationRule<number>
  validate?: Validate<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const TextAreaInput: FC<Props> = (props) => {
  const { label, disabled, placeholder, rows, register, required, minLength, maxLength, validate } = props
  return (
    <textarea
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none"
      {...register(label, { required, minLength, validate, maxLength })}
    />
  )
}
