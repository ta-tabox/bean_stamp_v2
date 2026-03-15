import type { FC } from 'react'
import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'

import { PrimaryButton } from '@/components/Elements/Button'
import { Link } from '@/components/Elements/Link'
import { NotificationMessage } from '@/components/Elements/Notification'
import { FormContainer, FormFooter, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { useAuth } from '@/features/auth'
import { GuestSignInButton } from '@/features/auth/components/atoms/GuestSignInButton'
import type { SignUpParams } from '@/features/auth/types'
import { EmailInput, PasswordInput, PrefectureSelect, UserNameInput } from '@/features/users'
import { PasswordConfirmationInput } from '@/features/users/components/molecules/PasswordConfirmationInput'
import { useMessage } from '@/hooks/useMessage'
import { useNotification } from '@/hooks/useNotification'
import type { PrefectureOption } from '@/utils/prefecture'

import type { FieldError, SubmitHandler } from 'react-hook-form'

// react-hook-formで取り扱うデータの型
type SignUpSubmitData = SignUpParams & {
  prefectureOption: PrefectureOption
}

export const SignUp: FC = memo(() => {
  const { signUp, loading } = useAuth()
  const { notifications } = useNotification()
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
    control,
  } = useForm<SignUpSubmitData>({ criteriaMode: 'all' })

  const onSubmit: SubmitHandler<SignUpSubmitData> = async (data) => {
    const params: SignUpParams = {
      name: data.name,
      email: data.email,
      prefectureCode: data.prefectureOption.value.toString(),
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
    }

    try {
      await signUp({ params })
      setIsError(false)
      showMessage({ message: 'ユーザー登録が完了しました', type: 'success' })
      navigate('/users/home')
    } catch (error) {
      if (error instanceof AxiosError) {
        setIsError(true)
      }
    }
  }

  return (
    <>
      <Head title="サインアップ" />
      <div className="mt-16 flex items-center">
        <FormContainer>
          <FormMain>
            <FormTitle>サインアップ</FormTitle>
            {isError ? <NotificationMessage notifications={notifications} type="error" /> : null}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 名前 */}
              <UserNameInput label="name" register={register} error={errors.name} />

              {/* メールアドレス */}
              <EmailInput label="email" register={register} error={errors.email} />

              {/* エリアセレクト */}
              <PrefectureSelect
                label="prefectureOption"
                control={control}
                error={errors.prefectureOption as FieldError}
              />

              {/* パスワード */}
              <PasswordInput label="password" register={register} error={errors.password} />

              {/* パスワード確認 */}
              <PasswordConfirmationInput
                label="passwordConfirmation"
                targetValue={watch('password')}
                register={register}
                error={errors.passwordConfirmation}
              />

              <div className="flex items-center justify-center mt-4">
                <PrimaryButton
                  disabled={
                    !dirtyFields.name ||
                    !dirtyFields.email ||
                    !dirtyFields.prefectureOption ||
                    !dirtyFields.password ||
                    !dirtyFields.passwordConfirmation
                  }
                  loading={loading}
                >
                  登録
                </PrimaryButton>
              </div>
            </form>
          </FormMain>

          <FormFooter>
            <h4 className="pb-2">
              アカウントをお持ちですか？
              <Link to="/auth/signin">サインイン</Link>
            </h4>

            <h4 className="pt-4 text-center text-sm text-gray-800 font-light">閲覧用</h4>
            <div>
              <div className="flex justify-center">
                <GuestSignInButton />
              </div>
            </div>
          </FormFooter>
        </FormContainer>
      </div>
    </>
  )
})
