import type { FC } from 'react'

import { FormIconWrap, FormInputWrap, Input } from '@/components/Form'

import type { UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const BeanSubregionInput: FC<InputProps> = (props) => {
  const { label, register } = props
  return (
    <FormInputWrap>
      <Input label={label} type="text" placeholder="地域" register={register} />
      <FormIconWrap>
        <svg className="h-7 w-7 p-1 ml-3">
          <use xlinkHref="#location-marker" />
        </svg>
      </FormIconWrap>
    </FormInputWrap>
  )
}
