import type { ChangeEventHandler, FC } from 'react'

import type { UseFormRegister, Validate, ValidationRule } from 'react-hook-form'

type Props = {
  label: string
  disabled?: boolean
  multiple?: boolean
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  required?: string | ValidationRule<boolean>
  maxLength?: ValidationRule<number>
  validate?: Validate<any> | Record<string, Validate<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const FileInput: FC<Props> = (props) => {
  const { label, disabled, multiple, register, required, validate, onChange } = props
  return (
    <input
      type="file"
      disabled={disabled}
      multiple={multiple}
      className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none bg-white"
      {...register(label, { required, validate, onChange })}
    />
  )
}
