import type { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'

import { PrimaryButton } from '@/components/Elements/Button'
import { ImagePreview } from '@/components/Form'
import { useLoadUser } from '@/features/auth'
import { updateUser } from '@/features/users/api/updateUser'
import { EmailInput } from '@/features/users/components/molecules/EmailInput'
import { PrefectureSelect } from '@/features/users/components/molecules/PrefectureSelect'
import { UserDescribeInput } from '@/features/users/components/molecules/UserDescribeInput'
import { UserImageInput } from '@/features/users/components/molecules/UserImageInput'
import { UserNameInput } from '@/features/users/components/molecules/UserNameInput'
import type { User, UserUpdateParams } from '@/features/users/types'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { DeviseErrorResponse } from '@/types'
import type { PrefectureOption } from '@/utils/prefecture'
import { convertPrefectureCodeToIndex, prefectureOptions } from '@/utils/prefecture'

import type { SubmitHandler, FieldError } from 'react-hook-form'

type Props = {
  user: User
  setIsError: Dispatch<SetStateAction<boolean>>
}

// react-hook-formで取り扱うデータの型
type UserUpdateData = UserUpdateParams & {
  prefectureOption: PrefectureOption
}

export const UserUpdateForm: FC<Props> = (props) => {
  const { user, setIsError } = props
  const navigate = useNavigate()

  const { loadUser } = useLoadUser()
  const { showMessage } = useMessage()
  const { setErrorNotifications } = useErrorNotification()

  // codeId -> 配列のindexへ変換
  const prefectureCodeIndex = convertPrefectureCodeToIndex(user.prefectureCode)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<Array<string>>()

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    control,
  } = useForm<UserUpdateData>({
    criteriaMode: 'all',
    defaultValues: {
      name: user.name,
      email: user.email,
      prefectureOption: prefectureOptions[prefectureCodeIndex],
      describe: user.describe,
    },
  })

  const onSubmit: SubmitHandler<UserUpdateData> = useCallback(async (data) => {
    // PUTリクエスト用のフォームを作成する
    const createFormData = () => {
      const formData = new FormData()
      // 画像が選択されていない場合は更新しない
      if (data.image[0]) {
        formData.append('image', data.image[0])
      }
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('prefecture_code', data.prefectureOption.value.toString())
      if (data.describe) {
        formData.append('describe', data.describe)
      }
      return formData
    }

    const formData = createFormData()

    // ゲストユーザーを制限する
    if (user.guest) {
      showMessage({ message: 'ゲストユーザーの編集はできません', type: 'error' })
      navigate('/')
      return
    }

    try {
      setLoading(true)
      await updateUser({ formData })
      setIsError(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        // NOTE errorの型指定 他に良い方法はないのか？
        const typedError = error as AxiosError<DeviseErrorResponse>
        const errorMessages = typedError.response?.data.errors.fullMessages
        if (errorMessages) {
          setErrorNotifications(errorMessages)
          setIsError(true)
        }
      }
      return
    } finally {
      setLoading(false)
    }

    // NOTE メールアドレス変更時にAPIとの認証ができなくなり、再サインインが求められる。
    if (user.email !== data.email) {
      showMessage({
        message: `ユーザー情報を変更しました。再度サインインをしてください。`,
        type: 'success',
      })
      await loadUser()
    } else {
      showMessage({ message: 'ユーザー情報を変更しました', type: 'success' })
      await loadUser()
      navigate('/users/home')
    }
  }, [])

  // プレビュー機能
  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      // WARNING ChromeではURL.createObjectURLは廃止予定？変更する必要があるかもしれない
      setPreviewImage([URL.createObjectURL(e.target.files[0])])
    }
  }

  return (
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
      <UserImageInput label="image" register={register} error={errors.image} onChange={onChangeImage} />

      {/* 名前 */}
      <UserNameInput label="name" register={register} error={errors.name} />

      {/* メールアドレス */}
      <EmailInput label="email" register={register} error={errors.email} />

      {/* エリアセレクト */}
      <PrefectureSelect label="prefectureOption" control={control} error={errors.prefectureOption as FieldError} />

      {/* 詳細 */}
      <UserDescribeInput label="describe" register={register} error={errors.describe} />

      <div className="flex items-center justify-center mt-4">
        <PrimaryButton disabled={!isDirty} loading={loading}>
          更新
        </PrimaryButton>
      </div>
    </form>
  )
}
