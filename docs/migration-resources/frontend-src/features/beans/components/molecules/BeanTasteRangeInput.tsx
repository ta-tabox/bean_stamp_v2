import type { FC } from 'react'

import type { UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  name: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const BeanTasteRangeInput: FC<InputProps> = (props) => {
  const { name, label, register } = props
  return (
    <div className="flex justify-between w-11/12">
      <p className="text-gray-500 text-sm font-medium">{name}</p>
      <input id={label} type="range" min={1} max={5} defaultValue={3} {...register(label)} />
    </div>
  )
}
