import type { ChangeEventHandler, FC } from 'react'

import { AlertMessage, FileInput, FormIconWrap, FormInputWrap } from '@/components/Form'

import type { FieldError, UseFormRegister } from 'react-hook-form'

type InputProps = {
  label: string
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const maxImageNum = 4
const maxImageMb = 5

export const BeanImageInput: FC<InputProps> = (props) => {
  const { label, register, error, onChange } = props
  return (
    <>
      <FormInputWrap>
        <FileInput
          label={label}
          multiple
          register={register}
          onChange={onChange}
          validate={{
            maxLength: (values: FileList) => {
              if (values.length > maxImageNum) {
                return `画像は最大${maxImageNum}枚まで投稿できます`
              }
              return true
            },
            maxSize: (values: FileList) => {
              for (let i = 0; i < values.length; i += 1) {
                const sizeInMb = values[i].size / 1024 / 1024
                if (sizeInMb > maxImageMb) {
                  return `画像は最大5MBのサイズまで投稿できます. ${maxImageMb}MBより小さいファイルを選択してください.`
                }
              }
              return true
            },
          }}
        />
        <FormIconWrap>
          <i className="fa-solid fa-image fa-lg ml-3 p-1" />
        </FormIconWrap>
      </FormInputWrap>
      {error?.types?.maxSize && <AlertMessage>{error.types.maxSize}</AlertMessage>}
      {error?.types?.maxLength && <AlertMessage>{error.types.maxLength}</AlertMessage>}
    </>
  )
}
