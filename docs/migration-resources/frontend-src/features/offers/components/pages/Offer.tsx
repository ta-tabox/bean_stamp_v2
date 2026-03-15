import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { DangerButton, SecondaryButton } from '@/components/Elements/Button'
import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Head } from '@/components/Head'
import { BeanCard } from '@/features/beans'
import { OfferCancelModal } from '@/features/offers/components/organisms/OfferCancelModal'
import { OfferDetailCard } from '@/features/offers/components/organisms/OfferDetailCard'
import { OfferEditModal } from '@/features/offers/components/organisms/OfferEditModal'
import { useGetOffer } from '@/features/offers/hooks/useGetOffer'
import { useCurrentRoaster } from '@/features/roasters'
import { useMessage } from '@/hooks/useMessage'
import { useModal } from '@/hooks/useModal'
import { getToday } from '@/utils/date'
import { isNumber } from '@/utils/regexp'

export const Offer: FC = () => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const { offer, getOffer, setOffer } = useGetOffer()
  const { currentRoaster } = useCurrentRoaster()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useModal()
  const { isOpen: isOpenOfferEdit, onOpen: onOpenOfferEdit, onClose: onCloseOfferEdit } = useModal()

  useEffect(() => {
    if (urlParams.id && isNumber(urlParams.id)) {
      getOffer(urlParams.id)
    } else {
      navigate('/')
    }
  }, [urlParams.id])

  const onClickEdit = () => {
    if (offer) {
      if (getToday() >= offer.endedAt) {
        showMessage({ message: 'オファー終了日後は編集できません', type: 'error' })
      } else {
        onOpenOfferEdit()
      }
    }
  }

  const onClickDelete = () => {
    onOpenDelete()
  }
  return (
    <>
      <Head title="オファー詳細" />
      <ContentHeader>
        <div className="h-full flex flex-col sm:flex-row justify-between sm:items-end">
          <ContentHeaderTitle title="オファー詳細" />
          {offer && offer.roaster.id === currentRoaster?.id && (
            <div className="flex items-end ml-auto space-x-2">
              <SecondaryButton onClick={onClickEdit}>編集</SecondaryButton>
              <DangerButton onClick={onClickDelete}>削除</DangerButton>
            </div>
          )}
        </div>
      </ContentHeader>

      <section className="mt-8 mb-20">
        {offer && (
          <>
            <section className="mt-16">
              <OfferDetailCard offer={offer} />
            </section>

            <section className="mt-8 mb-20">
              <BeanCard bean={offer.bean} />
            </section>
            <OfferCancelModal offer={offer} isOpen={isOpenDelete} onClose={onCloseDelete} />
            <OfferEditModal offer={offer} isOpen={isOpenOfferEdit} onClose={onCloseOfferEdit} setOffer={setOffer} />
          </>
        )}
      </section>
    </>
  )
}
