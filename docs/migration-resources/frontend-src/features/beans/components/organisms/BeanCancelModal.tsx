import type { FC } from 'react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { DangerButton, SecondaryButton } from '@/components/Elements/Button'
import { Modal, ModalContainer, ModalText, ModalTitle } from '@/components/Elements/Modal'
import { deleteBean } from '@/features/beans/api/deleteBean'
import type { Bean } from '@/features/beans/types'
import { useMessage } from '@/hooks/useMessage'

type Props = {
  isOpen: boolean
  onClose: () => void
  bean: Bean
}

export const BeanCancelModal: FC<Props> = memo((props) => {
  const { isOpen, onClose, bean } = props
  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const onClickDelete = async () => {
    try {
      await deleteBean({ id: bean.id.toString() })
    } catch {
      showMessage({
        message: 'コーヒー豆の削除に失敗しました',
        type: 'error',
      })
      return
    }

    showMessage({ message: 'コーヒー豆を削除しました', type: 'success' })
    navigate('/beans')
  }

  return (
    <Modal contentLabel="コーヒー豆の削除" isOpen={isOpen} onClose={onClose} closeButton>
      <ModalContainer>
        <ModalTitle>コーヒー豆の削除</ModalTitle>
        <ModalText>
          <>
            コーヒー豆「{`${bean.name}`}」を削除します。
            <br />
            この操作は取り消すことができません。
            <br />
            ＊オファーがあるコーヒー豆を削除することはできません。
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
