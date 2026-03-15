import type { Dispatch, FC } from 'react'
import React, { memo } from 'react'

import type { Offer } from '@/features/offers'
import { createWant } from '@/features/wants/api/createWant'
import { deleteWant } from '@/features/wants/api/deleteWant'
import { useGetWantsStats } from '@/features/wants/hooks/useGetWantsStats'
import { isAfterEndedAt } from '@/features/wants/utils/isAfterEndedAt'
import { useMessage } from '@/hooks/useMessage'
import { formattedToJaDate } from '@/utils/date'

type Props = {
  offer: Offer
  wantId: number | null
  setWantId: Dispatch<React.SetStateAction<number | null>>
  wantCount: number
  setWantCount: Dispatch<React.SetStateAction<number>>
}

export const WantUnWantButton: FC<Props> = memo((props) => {
  const { offer, wantId, setWantId, setWantCount, wantCount } = props
  const { showMessage } = useMessage()
  const { getWantsStats } = useGetWantsStats()

  const onClickWant = () => {
    createWant({ offerId: offer.id })
      .then((response) => {
        setWantId(response.data.id) // deleteリクエストで使用するurl: /wants/:idに使用
        setWantCount(wantCount + 1) // OfferCardで使用するfollower数
        getWantsStats() // サインインユーザーのウォントの統計を再取得
        showMessage({
          message: `${offer.bean.name}をウォントしました!「${formattedToJaDate(
            offer.receiptStartedAt
          )}」からお受け取りできます`,
          type: 'success',
        })
      })
      .catch(() => {
        showMessage({ message: 'ウォントに失敗しました', type: 'error' })
      })
  }

  const onClickUnWant = () => {
    if (wantId) {
      deleteWant({ id: wantId })
        .then(() => {
          setWantId(null) // want削除に伴うりセット
          setWantCount(wantCount - 1) // OfferCardで使用するfollower数
          getWantsStats() // サインインユーザーのウォントの統計を再取得
          showMessage({ message: `${offer.bean.name}のウォントを取り消しました`, type: 'success' })
        })
        .catch(() => {
          showMessage({ message: 'ウォントの削除に失敗しました', type: 'error' })
        })
    }
  }

  const isMaxAmount = () => wantCount === offer.amount

  return (
    <div className="relative w-16 text-center">
      {wantId ? (
        <button type="button" onClick={onClickUnWant} disabled={isAfterEndedAt({ offer })}>
          <svg className={`w-10 h-10 text-indigo-500 ${isAfterEndedAt({ offer }) ? 'opacity-50' : ''}`}>
            <use xlinkHref="#check-circle-solid" />
          </svg>
        </button>
      ) : (
        <button type="button" onClick={onClickWant} disabled={isMaxAmount() || isAfterEndedAt({ offer })}>
          <svg
            className={`w-10 h-10 mx-auto text-indigo-600 ${
              isMaxAmount() || isAfterEndedAt({ offer }) ? 'opacity-50' : ''
            }`}
          >
            <use xlinkHref="#check-circle" />
          </svg>
        </button>
      )}
      <p className="absolute -bottom-2 inset-x-0 text-xs tracking-tighter">{wantId ? 'ウォント中' : 'ウォント'}</p>
    </div>
  )
})
