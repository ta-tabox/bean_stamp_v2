import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { DangerButton, PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Head } from '@/components/Head'
import { BeanCancelModal } from '@/features/beans/components/organisms/BeanCancelModal'
import { BeanCard } from '@/features/beans/components/organisms/BeanCard'
import { useGetBean } from '@/features/beans/hooks/useGetBean'
import { OfferNewModal } from '@/features/offers'
import { useModal } from '@/hooks/useModal'
import { isNumber } from '@/utils/regexp'

export const Bean: FC = () => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { bean, getBean } = useGetBean()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useModal()
  const { isOpen: isOpenOfferNew, onOpen: onOpenOfferNew, onClose: onCloseOfferNew } = useModal()

  useEffect(() => {
    if (urlParams.id && isNumber(urlParams.id)) {
      getBean(urlParams.id)
    } else {
      navigate('/roasters/home')
    }
  }, [urlParams.id])

  const onClickOffer = () => {
    onOpenOfferNew()
  }

  const onClickEdit = () => {
    if (bean) {
      const editUrl = `/beans/${bean.id}/edit`
      navigate(editUrl)
    }
  }

  const onClickDelete = () => {
    onOpenDelete()
  }
  return (
    <>
      <Head title="コーヒー豆詳細" />
      <ContentHeader>
        <div className="h-full flex flex-col sm:flex-row justify-between sm:items-end">
          <ContentHeaderTitle title="コーヒー豆詳細" />
          <div className="flex items-end ml-auto space-x-2">
            <PrimaryButton onClick={onClickOffer}>オファー</PrimaryButton>
            <SecondaryButton onClick={onClickEdit}>編集</SecondaryButton>
            <DangerButton onClick={onClickDelete}>削除</DangerButton>
          </div>
        </div>
      </ContentHeader>

      <section className="mt-8 mb-20">
        {bean && (
          <>
            <BeanCard bean={bean} />
            <BeanCancelModal bean={bean} isOpen={isOpenDelete} onClose={onCloseDelete} />
            <OfferNewModal beanId={bean.id} beanName={bean.name} isOpen={isOpenOfferNew} onClose={onCloseOfferNew} />
          </>
        )}
      </section>
    </>
  )
}
