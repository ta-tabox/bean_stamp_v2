import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'

import { Link } from '@/components/Elements/Link'
import { NotificationMessage } from '@/components/Elements/Notification'
import { Spinner } from '@/components/Elements/Spinner'
import { FormContainer, FormFooter, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { useLoadUser } from '@/features/auth'
import { updateRoaster } from '@/features/roasters/api/updateRoaster'
import { RoasterThumbnail } from '@/features/roasters/components/molecules/RoasterThumbnail'
import { RoasterForm } from '@/features/roasters/components/organisms/RoasterForm'
import { useCurrentRoaster } from '@/features/roasters/hooks/useCurrentRoaster'
import type { RoasterCreateData } from '@/features/roasters/types'
import { createRoasterFormData } from '@/features/roasters/utils/createRoasterFormData'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { ApplicationMessagesResponse } from '@/types'

import type { SubmitHandler } from 'react-hook-form'

export const RoasterEdit: FC = () => {
  const { setErrorNotifications, errorNotifications } = useErrorNotification()
  const { showMessage } = useMessage()
  const navigate = useNavigate()
  const { loadUser } = useLoadUser()

  const { setIsRoaster, currentRoaster } = useCurrentRoaster()

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<RoasterCreateData> = useCallback(
    async (data) => {
      if (currentRoaster === null) {
        showMessage({ message: 'ロースターを登録をしてください', type: 'error' })
        navigate('/roasters/create')
        return
      }

      // ゲストロースターを制限する
      if (currentRoaster.guest) {
        showMessage({ message: 'ゲストロースターの編集はできません', type: 'error' })
        navigate('/')
        return
      }

      const formData = createRoasterFormData(data)

      try {
        setLoading(true)
        await updateRoaster({ id: currentRoaster.id.toString(), formData })
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
      showMessage({ message: 'ロースター情報を変更しました', type: 'success' })
      navigate('/roasters/home')
    },
    [currentRoaster]
  )

  return (
    <>
      <Head title="ロースター編集" />
      {!currentRoaster && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {currentRoaster && (
        <div className="mt-20">
          <FormContainer>
            <div className="flex justify-end -mb-10">
              <RoasterThumbnail name={currentRoaster.name} thumbnailUrl={currentRoaster.thumbnailUrl} />
            </div>
            <FormMain>
              <FormTitle>ロースター情報編集</FormTitle>
              {isError ? <NotificationMessage notifications={errorNotifications} type="error" /> : null}

              <RoasterForm submitTitle="更新" loading={loading} onSubmit={onSubmit} roaster={currentRoaster} />

              <FormFooter>
                <Link to="/roasters/cancel">ロースターを削除する</Link>
              </FormFooter>
            </FormMain>
          </FormContainer>
        </div>
      )}
    </>
  )
}
