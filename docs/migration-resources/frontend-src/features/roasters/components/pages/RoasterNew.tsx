import type { FC } from 'react'
import { useCallback, useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'

import { NotificationMessage } from '@/components/Elements/Notification'
import { FormContainer, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { useLoadUser } from '@/features/auth'
import { createRoaster } from '@/features/roasters/api/createRoaster'
import { RoasterForm } from '@/features/roasters/components/organisms/RoasterForm'
import { useCurrentRoaster } from '@/features/roasters/hooks/useCurrentRoaster'
import type { RoasterCreateData } from '@/features/roasters/types'
import { createRoasterFormData } from '@/features/roasters/utils/createRoasterFormData'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { ApplicationMessagesResponse } from '@/types'

import type { SubmitHandler } from 'react-hook-form'

export const RoasterNew: FC = memo(() => {
  const { setErrorNotifications, errorNotifications } = useErrorNotification()
  const { showMessage } = useMessage()
  const navigate = useNavigate()
  const { loadUser } = useLoadUser()

  const { setIsRoaster } = useCurrentRoaster()

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<RoasterCreateData> = useCallback(async (data) => {
    const formData = createRoasterFormData(data)

    try {
      setLoading(true)
      await createRoaster({ formData })
      setIsError(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        // NOTE errorの型指定 他に良い方法はないのか？
        const typedError = error as AxiosError<ApplicationMessagesResponse>
        const errorMessages = typedError.response?.data.messages
        if (errorMessages) {
          setErrorNotifications(errorMessages)
          setIsError(true)
        }
      }
      return
    } finally {
      setLoading(false)
    }

    await loadUser()

    setIsRoaster(true)
    showMessage({ message: 'ロースターを作成しました', type: 'success' })
    navigate('/roasters/home')
  }, [])

  return (
    <>
      <Head title="ロースター登録" />
      <div className="mt-16 flex items-center">
        <FormContainer>
          <FormMain>
            <FormTitle>ロースター登録</FormTitle>
            {isError ? <NotificationMessage notifications={errorNotifications} type="error" /> : null}
            <RoasterForm submitTitle="登録" loading={loading} onSubmit={onSubmit} />
          </FormMain>
        </FormContainer>
      </div>
    </>
  )
})
