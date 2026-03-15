import type { FC } from 'react'

import type { UseFormRegister, Validate, ValidationRule } from 'react-hook-form'

type InputProps = {
  label: string
  disabled?: boolean
  type: React.HTMLInputTypeAttribute
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  placeholder?: string
  required?: string | ValidationRule<boolean>
  pattern?: ValidationRule<RegExp>
  minLength?: ValidationRule<number>
  maxLength?: ValidationRule<number>
  validate?: Validate<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  min?: ValidationRule<number>
  max?: ValidationRule<number>
  step?: number
}

export const Input: FC<InputProps> = (props) => {
  const {
    label,
    disabled,
    type,
    placeholder,
    register,
    required,
    pattern,
    minLength,
    maxLength,
    validate,
    min,
    max,
    step,
  } = props
  return (
    <input
      id={label}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      step={step}
      className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none"
      {...register(label, { required, pattern, minLength, maxLength, validate, min, max })}
    />
  )
}
