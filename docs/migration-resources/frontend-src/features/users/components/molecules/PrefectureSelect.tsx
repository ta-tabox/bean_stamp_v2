import type { FC } from 'react'

import { Controller } from 'react-hook-form'
import Select from 'react-select'

import { AlertMessage, FormIconWrap, FormInputWrap } from '@/components/Form'
import { prefectureOptions } from '@/utils/prefecture'
import { validation } from '@/utils/validation'

import type { Control, FieldError } from 'react-hook-form'

type InputProps = {
  label: string
  control: Control<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  require?: boolean
}

export const PrefectureSelect: FC<InputProps> = (props) => {
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
              options={prefectureOptions}
              isClearable
              styles={{ control: () => ({}), valueContainer: (provided) => ({ ...provided, padding: 0 }) }} // デフォルトのスタイルをクリア
              className="rs-container" // react-selectコンポーネントのクラス名
              classNamePrefix="rs" // react-selectコンポーネント化のクラスに"rs__"プリフィックスをつける
              noOptionsMessage={() => 'エリアが見つかりませんでした'}
              placeholder="エリアを選択"
              // defaultValue={prefectureOptions[1]}
            />
          )}
        />
        <FormIconWrap>
          <svg className="h-7 w-7 p-1 ml-3">
            <use xlinkHref="#location-marker" />
          </svg>
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
    </>
  )
}
