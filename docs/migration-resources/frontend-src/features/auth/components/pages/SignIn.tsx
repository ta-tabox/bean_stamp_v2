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
import { GuestSignInButton } from '@/features/auth/components/atoms/GuestSignInButton'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { SignInParams } from '@/features/auth/types'
import { EmailInput, PasswordInput } from '@/features/users'
import { useMessage } from '@/hooks/useMessage'
import { useNotification } from '@/hooks/useNotification'

import type { SubmitHandler } from 'react-hook-form'

// react-hook-formで取り扱うデータの型
export type SignInSubmitData = {
  params: SignInParams
  isRememberMe?: boolean
}

export const SignIn: FC = memo(() => {
  const navigate = useNavigate()
  const { signIn, loading } = useAuth()
  const { notifications } = useNotification()
  const { showMessage } = useMessage()

  const [isError, setIsError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<SignInSubmitData>({ criteriaMode: 'all' })

  const onSubmit: SubmitHandler<SignInSubmitData> = async (data) => {
    const { params, isRememberMe } = data
    try {
      await signIn({ params, isRememberMe })
      showMessage({ message: 'サインインしました', type: 'success' })
      navigate('/users/home')
    } catch (error) {
      if (error instanceof AxiosError) {
        setIsError(true)
      }
    }
  }
  return (
    <>
      <Head title="サインイン" />

      <div className="mt-16 flex items-center">
        <FormContainer>
          <FormMain>
            <FormTitle>サインイン</FormTitle>
            {isError ? <NotificationMessage notifications={notifications} type="error" /> : null}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* メールアドレス */}
              <EmailInput label="params.email" register={register} error={errors.params?.email} />
              {/* パスワード */}
              <PasswordInput label="params.password" register={register} error={errors.params?.password} />

              {/* remember me */}
              <div className="mt-2 ml-2 flex items-center align-middle">
                <input id="rememberMe" type="checkbox" className="cursor-pointer" {...register('isRememberMe')} />
                <label htmlFor="rememberMe" className="cursor-pointer text-gray-600 pl-3">
                  サインインを記録する
                </label>
              </div>

              <div className="flex items-center justify-center mt-4">
                <PrimaryButton loading={loading} disabled={!dirtyFields.params?.email || !dirtyFields.params.password}>
                  サインイン
                </PrimaryButton>
              </div>
            </form>
          </FormMain>
          <FormFooter>
            <h4 className="pb-2">
              パスワードを忘れましたか？
              <span className="ml-2">
                <Link to="/auth/password_reset">パスワード再設定</Link>
              </span>
            </h4>

            <h4>
              アカウントをお持ちではありませんか？
              <span className="ml-2">
                <Link to="/auth/signup">サインアップ</Link>
              </span>
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
