import type { FC } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import { PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { RoasterNameInput } from '@/features/roasters'
import { PrefectureSelect } from '@/features/users'
import type { PrefectureOption } from '@/utils/prefecture'

import type { SubmitHandler } from 'react-hook-form'

// react-hook-formで取り扱うデータの型
type RoasterSearchFormData = {
  name: string | null
  prefectureOption: PrefectureOption | null
}

export const RoasterSearchForm: FC = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, control, reset, setValue } = useForm<RoasterSearchFormData>({})

  const onClickReset = (): void => {
    reset()
    setValue('prefectureOption', null)
  }

  const onSubmit: SubmitHandler<RoasterSearchFormData> = (data) => {
    const name = data.name && { name: data.name }
    const prefectureCode = data.prefectureOption && { prefecture_code: data.prefectureOption.value.toString() }

    const query = createSearchParams({
      ...name,
      ...prefectureCode,
    }).toString()

    navigate(`/search/roasters?${query}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 店舗名 */}
      <RoasterNameInput label="name" register={register} require={false} />

      {/* 都道府県 */}
      <PrefectureSelect label="prefectureOption" control={control} require={false} />

      <div className="flex items-center justify-center space-x-4 mt-4">
        <SecondaryButton onClick={onClickReset} isButton>
          クリア
        </SecondaryButton>

        <PrimaryButton>検索</PrimaryButton>
      </div>
    </form>
  )
}
