import type { FC } from 'react'

import { Controller } from 'react-hook-form'
import Select from 'react-select'

import { AlertMessage, FormIconWrap, FormInputWrap } from '@/components/Form'
import { roastLevelOptions } from '@/features/beans/utils/roastLevel'
import { validation } from '@/utils/validation'

import type { Control, FieldError } from 'react-hook-form'

type InputProps = {
  label: string
  control: Control<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  require?: boolean
}

export const BeanRoastLevelSelectInput: FC<InputProps> = (props) => {
  const { label, control, error, require = true } = props

  return (
    <>
      <FormInputWrap>
        {/* react-selectをreact-hook-form管理下で使用 */}
        <Controller
          name={label}
          control={control}
          rules={require ? { required: validation.required } : {}}
          render={({ field }) => (
            <Select
              {...field}
              options={roastLevelOptions}
              isClearable
              styles={{ control: () => ({}), valueContainer: (provided) => ({ ...provided, padding: 0 }) }} // デフォルトのスタイルをクリア
              className="rs-container" // react-selectコンポーネントのクラス名
              classNamePrefix="rs" // react-selectコンポーネント化のクラスに"rs__"プリフィックスをつける
              noOptionsMessage={() => '焙煎度が見つかりませんでした'}
              placeholder="焙煎度を選択"
            />
          )}
        />
        <FormIconWrap>
          <i className="fa-solid fa-angle-down fa-solid fa-fire-flame-curved fa-lg ml-3 p-1" />
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
    </>
  )
}
