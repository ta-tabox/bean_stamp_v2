import type { FC } from 'react'
import { useCallback, useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'

import { NotificationMessage } from '@/components/Elements/Notification'
import { FormContainer, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { createBean } from '@/features/beans/api/createBean'
import { BeanForm } from '@/features/beans/components/organisms/BeanForm'
import type { BeanCreateUpdateData } from '@/features/beans/types'
import { createBeanFormData } from '@/features/beans/utils/createBeanFormData'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { ApplicationMessagesResponse } from '@/types'

import type { SubmitHandler } from 'react-hook-form'

export const BeanNew: FC = memo(() => {
  const { setErrorNotifications, errorNotifications } = useErrorNotification()
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<BeanCreateUpdateData> = useCallback(async (data) => {
    const formData = createBeanFormData(data)

    let beanId: number | undefined

    try {
      setLoading(true)
      await createBean({ formData }).then((response) => {
        beanId = response.data.id
      })
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

    showMessage({ message: 'コーヒー豆を登録しました。早速オファーを作成しましょう!', type: 'success' })
    if (typeof beanId === 'number') {
      navigate(`/beans/${beanId}`)
    }
  }, [])

  return (
    <>
      <Head title="コーヒー豆登録" />
      <div className="mt-16 flex items-center">
        <FormContainer>
          <FormMain>
            <FormTitle>コーヒー豆登録</FormTitle>
            {isError ? <NotificationMessage notifications={errorNotifications} type="error" /> : null}
            <BeanForm submitTitle="登録" loading={loading} onSubmit={onSubmit} />
          </FormMain>
        </FormContainer>
      </div>
    </>
  )
})
