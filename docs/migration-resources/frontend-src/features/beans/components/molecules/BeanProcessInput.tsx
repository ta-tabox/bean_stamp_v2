import type { FC } from 'react'

import { FormIconWrap, FormInputWrap, Input } from '@/components/Form'

import type { UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const BeanProcessInput: FC<InputProps> = (props) => {
  const { label, register } = props
  return (
    <FormInputWrap>
      <Input label={label} type="text" placeholder="精製方法" register={register} />
      <FormIconWrap>
        <i className="fa-solid fa-industry fa-lg ml-3 p-1" />
      </FormIconWrap>
    </FormInputWrap>
  )
}
