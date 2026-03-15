import type { FC } from 'react'
import { useEffect, useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AxiosError } from 'axios'

import { DangerButton } from '@/components/Elements/Button'
import { NotificationMessage } from '@/components/Elements/Notification'
import { Spinner } from '@/components/Elements/Spinner'
import { FormContainer, FormFooter, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { updateBean } from '@/features/beans/api/updateBean'
import { BeanCancelModal } from '@/features/beans/components/organisms/BeanCancelModal'
import { BeanForm } from '@/features/beans/components/organisms/BeanForm'
import { useGetBean } from '@/features/beans/hooks/useGetBean'
import type { BeanCreateUpdateData } from '@/features/beans/types'
import { createBeanFormData } from '@/features/beans/utils/createBeanFormData'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import { useModal } from '@/hooks/useModal'
import type { ApplicationMessagesResponse } from '@/types'
import { isNumber } from '@/utils/regexp'

import type { SubmitHandler } from 'react-hook-form'

export const BeanEdit: FC = () => {
  const { setErrorNotifications, errorNotifications } = useErrorNotification()
  const { showMessage } = useMessage()
  const urlParams = useParams<{ id: string }>()
  const { isOpen, onOpen, onClose } = useModal()
  const navigate = useNavigate()

  const { bean, getBean } = useGetBean()

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (urlParams.id && isNumber(urlParams.id)) {
      getBean(urlParams.id)
    } else {
      navigate('/roasters/home')
    }
  }, [urlParams.id])

  const onSubmit: SubmitHandler<BeanCreateUpdateData> = useCallback(
    async (data) => {
      if (!bean) {
        showMessage({ message: 'コーヒー豆を登録をしてください', type: 'error' })
        navigate('/beans/create')
        return
      }

      const formData = createBeanFormData(data)

      try {
        setLoading(true)
        await updateBean({ id: bean.id.toString(), formData })
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
      showMessage({ message: 'コーヒー豆情報を変更しました', type: 'success' })
      navigate(`/beans/${bean.id}`)
    },
    [bean]
  )

  const onClickDelete = () => {
    onOpen()
  }

  return (
    <>
      <Head title="コーヒー豆編集" />
      {!bean && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {bean && (
        <div className="mt-20">
          <FormContainer>
            <FormMain>
              <FormTitle>コーヒー豆編集</FormTitle>
              {isError ? <NotificationMessage notifications={errorNotifications} type="error" /> : null}

              <BeanForm submitTitle="更新" loading={loading} onSubmit={onSubmit} bean={bean} />

              <FormFooter>
                <DangerButton onClick={onClickDelete}>コーヒー豆を削除する</DangerButton>
              </FormFooter>
            </FormMain>
          </FormContainer>
          <BeanCancelModal bean={bean} isOpen={isOpen} onClose={onClose} />
        </div>
      )}
    </>
  )
}
