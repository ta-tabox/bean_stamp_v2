import type { FC } from 'react'
import { useCallback, useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AxiosError } from 'axios'

import { Modal } from '@/components/Elements/Modal'
import { NotificationMessage } from '@/components/Elements/Notification'
import { FormContainer, FormMain, FormTitle } from '@/components/Form'
import { createOffer } from '@/features/offers/api/createOffer'
import { OfferForm } from '@/features/offers/components/organisms/OfferForm'
import type { OfferCreateUpdateData } from '@/features/offers/types'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { ApplicationMessagesResponse } from '@/types'
import { formattedToJaDate } from '@/utils/date'

import type { SubmitHandler } from 'react-hook-form'

type Props = {
  isOpen: boolean
  onClose: () => void
  beanId: number
  beanName: string
}

export const OfferNewModal: FC<Props> = memo((props) => {
  const { isOpen, onClose, beanId, beanName } = props
  const { setErrorNotifications, errorNotifications } = useErrorNotification()
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<OfferCreateUpdateData> = useCallback((data) => {
    setLoading(true)
    createOffer({ data })
      .then((response) => {
        const offerId = response.data.id
        const { roastedAt } = response.data
        onClose()
        setIsError(false)
        showMessage({
          message: `オファーを作成しました! 焙煎予定日は「${formattedToJaDate(roastedAt)}」です`,
          type: 'success',
        })
        navigate(`/offers/${offerId}`)
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          // NOTE errorの型指定 他に良い方法はないのか？
          const typedError = error as AxiosError<ApplicationMessagesResponse>
          const errorMessages = typedError.response?.data.messages
          if (errorMessages) {
            setErrorNotifications(errorMessages)
            setIsError(true)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onAfterClose = () => {
    // エラー情報のリセット
    setIsError(false)
    setErrorNotifications([])
  }

  return (
    <Modal contentLabel="オファーの作成" isOpen={isOpen} onClose={onClose} onAfterClose={onAfterClose} closeButton>
      <FormContainer>
        <FormMain>
          <FormTitle>{`${beanName}のオファーを作成する`}</FormTitle>
          <OfferForm
            submitTitle="オファーする"
            loading={loading}
            onSubmit={onSubmit}
            beanId={beanId}
            onClose={onClose}
          />
        </FormMain>
        {isError ? <NotificationMessage notifications={errorNotifications} type="error" /> : null}
      </FormContainer>
    </Modal>
  )
})
