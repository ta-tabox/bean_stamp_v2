import type { FC } from 'react'

import { Controller } from 'react-hook-form'
import Select from 'react-select'

import { AlertMessage, FormIconWrap, FormInputWrap } from '@/components/Form'
import type { TasteTagOption } from '@/features/beans/utils/tasteTag'
import { tasteTagOptions } from '@/features/beans/utils/tasteTag'
import { validation } from '@/utils/validation'

import type { Control, FieldError } from 'react-hook-form'

type InputProps = {
  label: string
  control: Control<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  validate?: boolean
  isMulti?: boolean
}

export const BeanTasteTagSelectInput: FC<InputProps> = (props) => {
  const { label, control, error, validate = true, isMulti = true } = props

  const maxTasteTagNum = 3
  const minTasteTagNum = 2

  return (
    <>
      <FormInputWrap>
        {/* react-selectをreact-hook-form管理下で使用 */}
        <Controller
          name={label}
          control={control}
          rules={
            validate
              ? {
                  required: validation.required,
                  validate: {
                    minLength: (value: TasteTagOption[]) => {
                      if (value?.length < minTasteTagNum) {
                        return `フレーバーは${minTasteTagNum}個以上登録してください`
                      }
                      return true
                    },
                    maxLength: (value: TasteTagOption[]) => {
                      if (value?.length > maxTasteTagNum) {
                        return `フレーバーは最大${maxTasteTagNum}個まで登録できます`
                      }
                      return true
                    },
                  },
                }
              : {}
          }
          render={({ field }) => (
            <Select
              {...field}
              options={tasteTagOptions}
              isClearable
              isMulti={isMulti}
              menuPlacement="top"
              styles={{ control: () => ({}), valueContainer: (provided) => ({ ...provided, padding: 0 }) }} // デフォルトのスタイルをクリア
              className="rs-container" // react-selectコンポーネントのクラス名
              classNamePrefix="rs" // react-selectコンポーネント化のクラスに"rs__"プリフィックスをつける
              noOptionsMessage={() => 'フレーバーが見つかりませんでした'}
              placeholder={`フレーバーを選択${isMulti ? '（2〜3コ）' : ''}`}
            />
          )}
        />
        <FormIconWrap>
          <i className="fa-solid fa-mug-hot fa-lg ml-3 p-1" />
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.required && <AlertMessage>{error.types.required}</AlertMessage>}
      {error?.types?.maxLength && <AlertMessage>{error.types.maxLength}</AlertMessage>}
      {error?.types?.minLength && <AlertMessage>{error.types.minLength}</AlertMessage>}
    </>
  )
}
