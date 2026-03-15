import type { FC } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import { PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { BeanCountrySelectInput } from '@/features/beans/components/molecules/BeanCountrySelectInput'
import { BeanRoastLevelSelectInput } from '@/features/beans/components/molecules/BeanRoastLevelSelectInput'
import { BeanTasteTagSelectInput } from '@/features/beans/components/molecules/BeanTasteTagSelectInput'
import type { CountryOption } from '@/features/beans/utils/country'
import type { RoastLevelOption } from '@/features/beans/utils/roastLevel'
import type { TasteTagOption } from '@/features/beans/utils/tasteTag'
import { PrefectureSelect } from '@/features/users'
import type { PrefectureOption } from '@/utils/prefecture'

import type { SubmitHandler } from 'react-hook-form'

// react-hook-formで取り扱うデータの型
type OfferSearchFormData = {
  prefectureOption: PrefectureOption | null
  countryOption: CountryOption | null
  roastLevelOption: RoastLevelOption | null
  tasteTagOption: TasteTagOption | null
}

export const OfferSearchForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, control, reset, setValue } = useForm<OfferSearchFormData>({})

  const onClickReset = (): void => {
    reset()
    setValue('prefectureOption', null)
    setValue('countryOption', null)
    setValue('roastLevelOption', null)
    setValue('tasteTagOption', null)
  }

  const onSubmit: SubmitHandler<OfferSearchFormData> = (data) => {
    const prefectureCode = data.prefectureOption && { prefecture_code: data.prefectureOption.value.toString() }

    const countryId = data.countryOption && { country_id: data.countryOption.value.toString() }

    const roastLevelId = data.roastLevelOption && { roast_level_id: data.roastLevelOption.value.toString() }

    const tasteTagId = data.tasteTagOption && { taste_tag_id: data.tasteTagOption.value.toString() }

    const query = createSearchParams({ ...prefectureCode, ...countryId, ...roastLevelId, ...tasteTagId }).toString()
    navigate(`/search/offers?${query}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 都道府県 */}
      <PrefectureSelect label="prefectureOption" control={control} require={false} />

      {/* 生産国 セレクト */}
      <BeanCountrySelectInput label="countryOption" control={control} require={false} />

      {/* 焙煎度 セレクト */}
      <BeanRoastLevelSelectInput label="roastLevelOption" control={control} require={false} />

      {/* テイストタグ */}
      <BeanTasteTagSelectInput label="tasteTagOption" control={control} validate={false} isMulti={false} />

      <div className="flex items-center justify-center space-x-4 mt-4">
        <SecondaryButton onClick={onClickReset} isButton>
          クリア
        </SecondaryButton>

        <PrimaryButton>検索</PrimaryButton>
      </div>
    </form>
  )
}
