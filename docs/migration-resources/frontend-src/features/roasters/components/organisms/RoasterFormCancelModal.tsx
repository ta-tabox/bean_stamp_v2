import type { FC } from 'react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { Modal, ModalContainer, ModalText } from '@/components/Elements/Modal'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const RoasterFormCancelModal: FC<Props> = memo((props) => {
  const { isOpen, onClose } = props
  const navigate = useNavigate()

  const onClickOK = () => {
    navigate(-1)
  }

  return (
    <Modal contentLabel="ロースターフォームデータのリセット" isOpen={isOpen} onClose={onClose} closeButton>
      <ModalContainer>
        <ModalText>
          <>
            入力中のデータは削除されます。
            <br />
            キャンセルしますか？
          </>
        </ModalText>
        <div className="flex items-center justify-center mt-4 space-x-8">
          <SecondaryButton onClick={onClose}>戻る</SecondaryButton>
          <PrimaryButton onClick={onClickOK}>OK</PrimaryButton>
        </div>
      </ModalContainer>
    </Modal>
  )
})
