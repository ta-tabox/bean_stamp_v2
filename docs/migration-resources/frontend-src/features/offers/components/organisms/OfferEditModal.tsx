import type { Dispatch, FC } from 'react'
import { useCallback, useState, memo } from 'react'

import { AxiosError } from 'axios'

import { Modal } from '@/components/Elements/Modal'
import { NotificationMessage } from '@/components/Elements/Notification'
import { FormContainer, FormMain, FormTitle } from '@/components/Form'
import { updateOffer } from '@/features/offers/api/updateOffer'
import { OfferForm } from '@/features/offers/components/organisms/OfferForm'
import type { Offer, OfferCreateUpdateData } from '@/features/offers/types'
import { useErrorNotification } from '@/hooks/useErrorNotification'
import { useMessage } from '@/hooks/useMessage'
import type { ApplicationMessagesResponse } from '@/types'

import type { SubmitHandler } from 'react-hook-form'

type Props = {
  isOpen: boolean
  onClose: () => void
  offer: Offer
  setOffer: Dispatch<React.SetStateAction<Offer | undefined>>
}

export const OfferEditModal: FC<Props> = memo((props) => {
  const { isOpen, onClose, offer, setOffer } = props
  const { bean } = offer
  const { setErrorNotifications, errorNotifications } = useErrorNotification()
  const { showMessage } = useMessage()

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<OfferCreateUpdateData> = useCallback((data) => {
    setLoading(true)
    updateOffer({ id: offer.id.toString(), data })
      .then((response) => {
        onClose()
        setOffer(response.data) // Offer詳細ページのofferを更新
        setIsError(false)
        showMessage({ message: 'オファーを更新しました', type: 'success' })
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
    <Modal contentLabel="オファーの編集" isOpen={isOpen} onClose={onClose} onAfterClose={onAfterClose} closeButton>
      <FormContainer>
        <FormMain>
          <FormTitle>{`${bean.name}のオファーを編集する`}</FormTitle>
          <OfferForm
            submitTitle="更新"
            offer={offer}
            loading={loading}
            onSubmit={onSubmit}
            beanId={bean.id}
            onClose={onClose}
          />
        </FormMain>
        {isError ? <NotificationMessage notifications={errorNotifications} type="error" /> : null}
      </FormContainer>
    </Modal>
  )
})
