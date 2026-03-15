import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@/components/Elements/Button'
import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Link } from '@/components/Elements/Link'
import { Head } from '@/components/Head'
import { BeanCard } from '@/features/beans'
import { OfferDetailCard } from '@/features/offers'
import { patchWantByReceipt } from '@/features/wants/api/patchWantByReceipt'
import { WantRateIcon } from '@/features/wants/components/molecules/WantRateIcon'
import { WantRateModal } from '@/features/wants/components/organisms/WantRateModal'
import { useGetWant } from '@/features/wants/hooks/useGetWant'
import { useGetWantsStats } from '@/features/wants/hooks/useGetWantsStats'
import { isAfterReceiptStartedAt } from '@/features/wants/utils/isAfterReceiptStartedAt'
import { useMessage } from '@/hooks/useMessage'
import { useModal } from '@/hooks/useModal'
import { isNumber } from '@/utils/regexp'

export const Want: FC = () => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { want, getWant, setWant } = useGetWant()
  const { getWantsStats } = useGetWantsStats()
  const { isOpen: isOpenRate, onOpen: onOpenRate, onClose: onCloseRate } = useModal()
  const { showMessage } = useMessage()

  useEffect(() => {
    if (urlParams.id && isNumber(urlParams.id)) {
      getWant(urlParams.id)
    } else {
      navigate('/')
    }
  }, [urlParams.id])

  const onClickReceive = () => {
    if (want) {
      patchWantByReceipt({ id: want.id })
        .then((response) => {
          setWant(response.data)
          getWantsStats() // サインインユーザーのウォントの統計を再取得
          showMessage({ message: '受け取りを完了しました', type: 'success' })
        })
        .catch(() => {
          showMessage({ message: 'すでに受け取りが完了しています', type: 'error' })
        })
    }
  }

  const onClickRate = () => {
    onOpenRate()
  }

  return (
    <>
      <Head title="ウォント詳細" />
      <ContentHeader>
        <div className="h-full flex flex-col sm:flex-row justify-between sm:items-end">
          <ContentHeaderTitle title="ウォント詳細" />
          <Link to="/wants">一覧へ戻る</Link>
        </div>
      </ContentHeader>
      <section className="mt-8 mb-20">
        {want && (
          <>
            {/* 受け取り、評価ボタン */}
            <div className="flex md:justify-center justify-end mr-4 sm:mr-8">
              {!want.receiptedAt ? (
                <PrimaryButton onClick={onClickReceive} disabled={!isAfterReceiptStartedAt({ offer: want.offer })}>
                  コーヒー豆を受け取りました!
                </PrimaryButton>
              ) : null}

              {want.receiptedAt &&
                (want.rate === 'unrated' ? (
                  <div className="animate-bounce">
                    <PrimaryButton onClick={onClickRate}>コーヒー豆を評価する</PrimaryButton>
                  </div>
                ) : (
                  // 評価スタンプ
                  <div className="w-20 h-20 flex flex-col items-center justify-center border-2 border-indigo-400 bg-indigo-400 text-white rounded">
                    <div className="fill-current text-white border-indigo-400">
                      <WantRateIcon rate={want.rate} />
                    </div>
                    <p className="text-xs font-normal uppercase tracking-tight text-white">{want.rate}</p>
                  </div>
                ))}
            </div>

            <section className="mt-16">
              <OfferDetailCard offer={want.offer} />
            </section>

            <section className="mt-8 mb-20">
              <BeanCard bean={want.offer.bean} />
            </section>
            <WantRateModal
              isOpen={isOpenRate}
              onClose={onCloseRate}
              wantId={want.id}
              beanName={want.offer.bean.name}
              setWant={setWant}
            />
          </>
        )}
      </section>
    </>
  )
}
