import type { FC } from 'react'

import { PrimaryButton } from '@/components/Elements/Button'
import { Spinner } from '@/components/Elements/Spinner'
import { FormContainer, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { RoasterCancelModal } from '@/features/roasters/components/organisms/RoasterCancelModal'
import { useCurrentRoaster } from '@/features/roasters/hooks/useCurrentRoaster'
import { useModal } from '@/hooks/useModal'

export const RoasterCancel: FC = () => {
  const { isOpen, onOpen, onClose } = useModal()
  const { currentRoaster } = useCurrentRoaster()

  const onClickDelete = () => {
    onOpen()
  }

  return (
    <>
      <Head title="ロースターの削除" />
      {currentRoaster ? (
        <section className="mt-16 flex items-center">
          <FormContainer>
            <FormMain>
              <FormTitle>ロースターを削除しますか？</FormTitle>
              <p className="text-center text-xs text-gray-400">
                ロースター「{currentRoaster.name}」の削除を行います。
                <br />
                同ロースターによるオファーやビーンズなどのデータは全て失われます。
              </p>
              <div className="flex items-center justify-center mt-4">
                <PrimaryButton onClick={onClickDelete}>削除する</PrimaryButton>
              </div>
            </FormMain>
          </FormContainer>
          <RoasterCancelModal isOpen={isOpen} onClose={onClose} roaster={currentRoaster} />
        </section>
      ) : (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </>
  )
}
