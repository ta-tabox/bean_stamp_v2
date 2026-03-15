import type { ChangeEvent, FC } from 'react'
import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { ImagePreview } from '@/components/Form'
import { RoasterAddressInput } from '@/features/roasters/components/molecules/RoasterAddressInput'
import { RoasterImageInput } from '@/features/roasters/components/molecules/RoasterImageInput'
import { RoasterNameInput } from '@/features/roasters/components/molecules/RoasterNameInput'
import { RoasterPhoneNumberInput } from '@/features/roasters/components/molecules/RoasterPhoneNumberInput'
import { RoasterDescribeInput } from '@/features/roasters/components/molecules/RosterDescribeInput'
import { RoasterFormCancelModal } from '@/features/roasters/components/organisms/RoasterFormCancelModal'
import type { Roaster, RoasterCreateData } from '@/features/roasters/types'
import { PrefectureSelect } from '@/features/users'
import { useModal } from '@/hooks/useModal'
import { convertPrefectureCodeToIndex, prefectureOptions } from '@/utils/prefecture'

import type { FieldError, SubmitHandler } from 'react-hook-form'

type Props = {
  roaster?: Roaster | null
  loading: boolean
  submitTitle: string
  onSubmit: SubmitHandler<RoasterCreateData>
}

export const RoasterForm: FC<Props> = (props) => {
  const { roaster = null, loading, submitTitle, onSubmit } = props
  const { isOpen, onOpen, onClose } = useModal()

  const [previewImage, setPreviewImage] = useState<Array<string>>()

  // フォーム初期値の設定 RoasterNew -> {}, RoasterEdit -> {初期値}
  const defaultValues = () => {
    let values = {}
    if (roaster) {
      // codeId -> 配列のindexへ変換
      const prefectureCodeIndex = convertPrefectureCodeToIndex(roaster.prefectureCode)
      values = {
        name: roaster.name,
        phoneNumber: roaster.phoneNumber,
        prefectureOption: prefectureOptions[prefectureCodeIndex],
        address: roaster.address,
        describe: roaster.describe,
      }
    }
    return values
  }

  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields, errors },
    control,
  } = useForm<RoasterCreateData>({
    criteriaMode: 'all',
    defaultValues: defaultValues(),
  })

  const onClickCancel = (): void => {
    // キャンセル確認モーダルオープン
    onOpen()
  }

  // プレビュー機能
  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      // WARNING ChromeではURL.createObjectURLは廃止予定？変更する必要があるかもしれない
      setPreviewImage([URL.createObjectURL(e.target.files[0])])
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* プレビューフィールド */}
        {previewImage && (
          <>
            <h2 className="e-font text-gray-500 text-center text-sm">〜 Preview 〜</h2>
            <div className="my-2">
              <ImagePreview imageUrls={previewImage} />
            </div>
          </>
        )}

        {/* ファイル */}
        <RoasterImageInput label="image" register={register} error={errors.image} onChange={onChangeImage} />

        {/* 店舗名 */}
        <RoasterNameInput label="name" register={register} error={errors.name} />

        {/* 電話番号 */}
        <RoasterPhoneNumberInput label="phoneNumber" register={register} error={errors.phoneNumber} />

        {/* 都道府県 */}
        <PrefectureSelect label="prefectureOption" control={control} error={errors.prefectureOption as FieldError} />
        {/* 住所 */}
        <RoasterAddressInput label="address" register={register} error={errors.address} />

        {/* 店舗紹介 */}
        <RoasterDescribeInput label="describe" register={register} error={errors.describe} />

        <div className="flex items-center justify-center space-x-4 mt-4">
          <SecondaryButton onClick={onClickCancel} isButton>
            キャンセル
          </SecondaryButton>
          {/* roasterあり→ どれか変更, なし→ 該当項目変更必須 */}
          <PrimaryButton
            disabled={
              roaster
                ? !isDirty
                : !dirtyFields.name || !dirtyFields.phoneNumber || !dirtyFields.prefectureOption || !dirtyFields.address
            }
            loading={loading}
          >
            {submitTitle}
          </PrimaryButton>
        </div>
      </form>
      <RoasterFormCancelModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
