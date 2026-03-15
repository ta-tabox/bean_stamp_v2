import type { FC } from 'react'

import { validation } from '@/utils/validation'

import type { UseFormRegister, ValidationRule } from 'react-hook-form'

type InputProps = {
  label: string
  disabled?: boolean
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  placeholder?: string
  required?: string | ValidationRule<boolean>
  min?: string | number
  max?: string | number
  shouldBeBeforeDate: string
  shouldBeBeforeDateName: string
  shouldBeAfterDate: string
  shouldBeAfterDateName: string
}

export const DateInput: FC<InputProps> = (props) => {
  const {
    label,
    disabled,
    placeholder,
    register,
    required,
    min,
    max,
    shouldBeAfterDate,
    shouldBeAfterDateName,
    shouldBeBeforeDate,
    shouldBeBeforeDateName,
  } = props
  return (
    <input
      id={label}
      type="date"
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      max={max}
      className="appearance-none border pl-1 sm:pl-4 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none"
      {...register(label, {
        required,
        validate: {
          shouldBeAfterDate: (value) =>
            validation.validate.shouldBeAfterDate(shouldBeAfterDate, value, shouldBeAfterDateName),
          shouldBeBeforeDate: (value) =>
            validation.validate.shouldBeBeforeDate(shouldBeBeforeDate, value, shouldBeBeforeDateName),
        },
      })}
    />
  )
}
