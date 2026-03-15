import type { ChangeEvent, FC } from 'react'
import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { ImagePreview } from '@/components/Form'
import { BeanCountrySelectInput } from '@/features/beans/components/molecules/BeanCountrySelectInput'
import { BeanCroppedAtInput } from '@/features/beans/components/molecules/BeanCroppedAtInput'
import { BeanDescribeInput } from '@/features/beans/components/molecules/BeanDescribeInput'
import { BeanElevationInput } from '@/features/beans/components/molecules/BeanElevationInput'
import { BeanFarmInput } from '@/features/beans/components/molecules/BeanFarmInput'
import { BeanImageInput } from '@/features/beans/components/molecules/BeanImageInput'
import { BeanImagesSwiper } from '@/features/beans/components/molecules/BeanImagesSwiper'
import { BeanNameInput } from '@/features/beans/components/molecules/BeanNameInput'
import { BeanProcessInput } from '@/features/beans/components/molecules/BeanProcessInput'
import { BeanRoastLevelSelectInput } from '@/features/beans/components/molecules/BeanRoastLevelSelectInput'
import { BeanSubregionInput } from '@/features/beans/components/molecules/BeanSubregionInput'
import { BeanTasteRangeInput } from '@/features/beans/components/molecules/BeanTasteRangeInput'
import { BeanTasteTagSelectInput } from '@/features/beans/components/molecules/BeanTasteTagSelectInput'
import { BeanVarietyInput } from '@/features/beans/components/molecules/BeanVarietyInput'
import { BeanFormCancelModal } from '@/features/beans/components/organisms/BeanFormCancelModal'
import type { Bean, BeanCreateUpdateData } from '@/features/beans/types'
import { countryOptions } from '@/features/beans/utils/country'
import { roastLevelOptions } from '@/features/beans/utils/roastLevel'
import { tasteTagOptions } from '@/features/beans/utils/tasteTag'
import { useModal } from '@/hooks/useModal'

import type { SubmitHandler, FieldError } from 'react-hook-form'

type Props = {
  bean?: Bean | null
  loading: boolean
  submitTitle: string
  onSubmit: SubmitHandler<BeanCreateUpdateData>
}

export const BeanForm: FC<Props> = (props) => {
  const { bean = null, loading, submitTitle, onSubmit } = props
  const { isOpen, onOpen, onClose } = useModal()

  const [previewImage, setPreviewImage] = useState<Array<string> | null>()

  // フォーム初期値の設定 BeanNew -> {}, BeanEdit -> {初期値}
  const defaultValues = () => {
    let values: BeanCreateUpdateData | undefined
    if (bean) {
      values = {
        name: bean.name,
        subregion: bean.subregion,
        farm: bean.farm,
        variety: bean.variety,
        elevation: bean.elevation,
        process: bean.process,
        croppedAt: bean.croppedAt,
        describe: bean.describe,
        acidity: bean.acidity,
        flavor: bean.flavor,
        body: bean.body,
        bitterness: bean.bitterness,
        sweetness: bean.sweetness,
        countryOption: countryOptions[bean.country.id - 1], // idをindexに合わせる
        roastLevelOption: roastLevelOptions[bean.roastLevel.id - 1], // idをindexに合わせる
        tasteTagOptions: bean.taste.ids.map((id) => tasteTagOptions[id - 1]), // 初期値としてオプションの配列を渡す idをindexに合わせる
        images: undefined,
      }
    }
    return values
  }

  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields, errors },
    control,
  } = useForm<BeanCreateUpdateData>({
    mode: 'onTouched',
    criteriaMode: 'all',
    defaultValues: defaultValues(),
  })

  const onClickCancel = (): void => {
    // キャンセル確認モーダルオープン
    onOpen()
  }

  // プレビュー表示
  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      setPreviewImage(null)
      return
    }

    const previewImages = Array.from(e.target.files)
    const previewImageUrls = previewImages.map((image) => URL.createObjectURL(image))
    setPreviewImage(previewImageUrls)
  }

  return (
    <>
      {bean && !previewImage && (
        <>
          {/* 既存画像のカルーセル */}
          <h2 className="e-font text-gray-500 text-center text-sm">〜 Images 〜</h2>
          <div className="my-2 h-64 lg:h-96">
            <BeanImagesSwiper imageUrls={bean.imageUrls} beanName={bean.name} />
          </div>
        </>
      )}

      {previewImage && (
        <>
          {/* プレビューフィールド */}
          <h2 className="e-font text-gray-500 text-center text-sm">〜 Preview 〜</h2>
          <div className="my-2">
            <ImagePreview imageUrls={previewImage} />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 画像インプット */}
        <BeanImageInput label="images[]" register={register} onChange={onChangeImage} error={errors.images} />

        <section className="mt-4">
          <h2 className="e-font text-gray-500 text-center text-sm">〜 Detail 〜</h2>
          {/* タイトル */}
          <BeanNameInput label="name" register={register} error={errors.name} />
          {/* 生産国 セレクト */}
          <BeanCountrySelectInput label="countryOption" control={control} error={errors.countryOption as FieldError} />

          {/* 焙煎度 セレクト */}
          <BeanRoastLevelSelectInput
            label="roastLevelOption"
            control={control}
            error={errors.roastLevelOption as FieldError}
          />

          {/* 地域 */}
          <BeanSubregionInput label="subregion" register={register} />

          {/* 農園 */}
          <BeanFarmInput label="farm" register={register} />

          {/* 品種 */}
          <BeanVarietyInput label="variety" register={register} />

          {/* 標高 */}
          <BeanElevationInput label="elevation" register={register} error={errors.elevation} />

          {/* 精製方法 */}
          <BeanProcessInput label="process" register={register} />

          {/* 収穫期 */}
          <BeanCroppedAtInput label="croppedAt" register={register} />

          {/* 紹介文 */}
          <BeanDescribeInput label="describe" register={register} error={errors.describe} />
        </section>
        {/* テイスト */}
        <section className="mt-4 w-11/12 sm:w-2/3 md:w-full mx-auto md:grid md:grid-cols-2 md:content-between">
          <h2 className="md:col-span-2 text-gray-500 text-center text-sm">〜 Taste 〜</h2>
          <BeanTasteRangeInput name="酸味" label="acidity" register={register} />
          <BeanTasteRangeInput name="フレーバー" label="flavor" register={register} />
          <BeanTasteRangeInput name="ボディ" label="body" register={register} />
          <BeanTasteRangeInput name="苦味" label="bitterness" register={register} />
          <BeanTasteRangeInput name="甘味" label="sweetness" register={register} />
        </section>
        {/* テイストタグ */}
        <section className="my-4">
          <h2 className="e-font text-gray-500 text-center text-sm">〜 Flavor 〜</h2>
          <BeanTasteTagSelectInput
            label="tasteTagOptions"
            control={control}
            error={errors.tasteTagOptions as FieldError}
          />
        </section>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <SecondaryButton onClick={onClickCancel} isButton>
            キャンセル
          </SecondaryButton>
          {/* beanあり(更新時)→ どれか変更, なし(新規作成時)→ 該当項目変更必須 */}
          <PrimaryButton
            disabled={
              bean
                ? !isDirty
                : !dirtyFields.name ||
                  !dirtyFields.countryOption ||
                  !dirtyFields.roastLevelOption ||
                  !dirtyFields.tasteTagOptions
            }
            loading={loading}
          >
            {submitTitle}
          </PrimaryButton>
        </div>
      </form>
      <BeanFormCancelModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
