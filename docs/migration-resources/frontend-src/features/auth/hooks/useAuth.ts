import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { SignInParams, SignUpParams } from '@/features/auth'
import { deleteUserReq } from '@/features/auth/api/deleteUser'
import { signInWithEmailAndPassword } from '@/features/auth/api/signIn'
import { signOutReq } from '@/features/auth/api/signOut'
import { signUpWithSignUpParams } from '@/features/auth/api/signUp'
import { useAuthCookies } from '@/features/auth/hooks/useAuthCookies'
import { useResetStates } from '@/features/auth/hooks/useResetStates'
import { useSignedInUser } from '@/features/auth/hooks/useSignedInUser'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { DeviseErrorResponse } from '@/types'

import type { AxiosError } from 'axios'

export const useAuth = () => {
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const [loading, setLoading] = useState(false)

  const { signedInUser, setIsSignedIn } = useSignedInUser()
  const { setAuthCookies, removeAuthCookies } = useAuthCookies()
  const { setErrorNotifications } = useErrorNotification()

  const { resetStates } = useResetStates()

  // サインアップ
  type SignUpOptions = {
    params: SignUpParams
  }
  const signUp = async ({ params }: SignUpOptions) => {
    setLoading(true)
    await signUpWithSignUpParams({ params })
      .then((res) => {
        // 認証情報をcookieにセット
        setAuthCookies({ res }) // authCookiesを元にloadUser()でセットするように変更
        setIsSignedIn(true)
        return Promise.resolve(signedInUser)
      })
      .catch((err: AxiosError<DeviseErrorResponse>) => {
        const errorMessages = err.response?.data.errors.fullMessages
        if (errorMessages) {
          setErrorNotifications(errorMessages)
        }
        return Promise.reject(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // サインイン
  type SignInOptions = {
    params: SignInParams
    isRememberMe?: boolean
  }

  const signIn = async ({ params, isRememberMe }: SignInOptions) => {
    setLoading(true)
    await signInWithEmailAndPassword({ params })
      .then((res) => {
        setAuthCookies({ res, isRememberMe }) // authCookiesを元にloadUser()でセットするように変更
        setIsSignedIn(true)
        return Promise.resolve(signedInUser)
      })
      .catch((err: AxiosError<{ errors: Array<string> }>) => {
        const errorMessages = err.response?.data.errors
        if (errorMessages) {
          setErrorNotifications(errorMessages)
        }
        return Promise.reject(err)
      })

      .finally(() => {
        setLoading(false)
      })
  }

  // サインアウト
  const signOut = () => {
    setLoading(true)

    signOutReq()
      .then(() => {
        // 認証情報をのcookieを削除
        removeAuthCookies()
        resetStates()
        showMessage({ message: 'サインアウトしました', type: 'success' })
        navigate('/auth/signin')
      })
      .catch(() => {
        showMessage({ message: 'サインアウトに失敗しました', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // アカウントの削除
  const deleteUser = async () => {
    setLoading(true)

    await deleteUserReq()
      .then(() => {
        // 認証情報をのcookieを削除
        removeAuthCookies()
        resetStates()
        return Promise.resolve(null)
      })
      .catch((err) => Promise.reject(err))
      .finally(() => {
        setLoading(false)
      })
  }

  return { signUp, signIn, signOut, deleteUser, loading }
}
