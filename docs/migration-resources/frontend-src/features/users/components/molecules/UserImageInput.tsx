import type { ChangeEventHandler, FC } from 'react'

import { AlertMessage, FileInput, FormIconWrap, FormInputWrap } from '@/components/Form'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const UserImageInput: FC<InputProps> = (props) => {
  const { label, register, error, onChange } = props
  return (
    <>
      <FormInputWrap>
        <FileInput label={label} register={register} onChange={onChange} />
        <FormIconWrap>
          <i className="fa-solid fa-image fa-lg ml-3 p-1" />
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
    </>
  )
}
