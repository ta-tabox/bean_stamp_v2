import type { FC } from 'react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { DangerButton, SecondaryButton } from '@/components/Elements/Button'
import { Modal, ModalContainer, ModalText, ModalTitle } from '@/components/Elements/Modal'
import { deleteOffer } from '@/features/offers/api/deleteOffer'
import type { Offer } from '@/features/offers/types'
import { useMessage } from '@/hooks/useMessage'
import type { ApplicationMessagesResponse } from '@/types'

import type { AxiosError } from 'axios'

type Props = {
  isOpen: boolean
  onClose: () => void
  offer: Offer
}

export const OfferCancelModal: FC<Props> = memo((props) => {
  const { isOpen, onClose, offer } = props
  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const onClickDelete = () => {
    deleteOffer({ id: offer.id.toString() })
      .then(() => {
        showMessage({ message: 'オファーを削除しました', type: 'success' })
        navigate('/offers')
      })
      .catch((error) => {
        const typedError = error as AxiosError<ApplicationMessagesResponse>
        // APIからのエラーメッセージを設定
        const errorMessages = typedError.response?.data.messages[0]
        showMessage({
          message: errorMessages ?? '',
          type: 'error',
        })
      })
  }

  return (
    <Modal contentLabel="オファーの削除" isOpen={isOpen} onClose={onClose} closeButton>
      <ModalContainer>
        <ModalTitle>オファーの削除</ModalTitle>
        <ModalText>
          <>
            「{`${offer.bean.name}`}」のオファーを削除します。
            <br />
            この操作は取り消すことができません。
            <br />
            ＊ウォントされているオファーを削除することはできません。
          </>
        </ModalText>
        <div className="flex items-center justify-center mt-4 space-x-4 sm:space-x-8">
          <SecondaryButton onClick={onClose}>戻る</SecondaryButton>
          <DangerButton onClick={onClickDelete}>了承して削除する</DangerButton>
        </div>
      </ModalContainer>
    </Modal>
  )
})
