import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'

import { PrimaryButton } from '@/components/Elements/Button'
import { NotificationMessage } from '@/components/Elements/Notification'
import { FormContainer, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import type { PasswordResetParams } from '@/features/auth'
import { useSignedInUser } from '@/features/auth'
import { updateUser } from '@/features/users/api/updateUser'
import { PasswordConfirmationInput } from '@/features/users/components/molecules/PasswordConfirmationInput'
import { PasswordInput } from '@/features/users/components/molecules/PasswordInput'
import { useMessage } from '@/hooks/useMessage'
import { useNotification } from '@/hooks/useNotification'

import type { SubmitHandler } from 'react-hook-form'

export const UserPassword: FC = () => {
  const { signedInUser } = useSignedInUser()
  const { showMessage } = useMessage()
  const { notifications } = useNotification()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty, errors },
  } = useForm<PasswordResetParams>({ criteriaMode: 'all' })

  const onSubmit: SubmitHandler<PasswordResetParams> = useCallback(async (data) => {
    const createFormData = () => {
      const formData = new FormData()

      formData.append('password', data.password)
      formData.append('passwordConfirmation', data.passwordConfirmation)
      return formData
    }

    const formData = createFormData()

    if (signedInUser?.guest) {
      showMessage({ message: 'ゲストユーザーの編集はできません', type: 'error' })
      return
    }

    try {
      setLoading(true)
      await updateUser({ formData })
      setIsError(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        setIsError(true)
      }
      return
    } finally {
      setLoading(false)
    }

    showMessage({ message: 'ユーザー情報を変更しました', type: 'success' })
    navigate('/users/home')
  }, [])

  return (
    <>
      <Head title="パスワード変更" />
      <div className="mt-16 flex items-center">
        <FormContainer>
          <FormMain>
            <FormTitle>パスワード変更</FormTitle>
            {isError ? <NotificationMessage notifications={notifications} type="error" /> : null}

            <p className="text-center text-xs text-gray-800">新しいパスワードを入力してください</p>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <PrimaryButton loading={loading} disabled={!isDirty}>
                  パスワード変更
                </PrimaryButton>
              </div>
            </form>
          </FormMain>
        </FormContainer>
      </div>
    </>
  )
}
