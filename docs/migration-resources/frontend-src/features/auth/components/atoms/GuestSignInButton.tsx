import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'

import { SecondaryButton } from '@/components/Elements/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useMessage } from '@/hooks/useMessage'

type Props = {
  sizeClass?: string
}

export const GuestSignInButton: FC<Props> = (props) => {
  const { sizeClass } = props
  const { signIn } = useAuth()
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  const onClickGuestSignIn = async () => {
    const params = {
      email: 'guest@example.com',
      password: 'password',
    }
    try {
      await signIn({ params })
      showMessage({ message: 'ゲストユーザーでサインインしました', type: 'success' })
      navigate('/users/home')
    } catch (error) {
      if (error instanceof AxiosError) {
        showMessage({ message: 'ゲストユーザーのサインインに失敗しました', type: 'error' })
      }
    }
  }
  return (
    <SecondaryButton onClick={onClickGuestSignIn} sizeClass={sizeClass}>
      ゲストユーザーでサインイン
    </SecondaryButton>
  )
}
