import type { Dispatch, FC } from 'react'
import React, { memo } from 'react'

import { createLike } from '@/features/likes/api/createLike'
import { deleteLike } from '@/features/likes/api/deleteLike'
import type { Offer } from '@/features/offers'
import { useMessage } from '@/hooks/useMessage'

type Props = {
  offer: Offer
  likeId: number | null
  setLikeId: Dispatch<React.SetStateAction<number | null>>
}

export const LikeUnLikeButton: FC<Props> = memo((props) => {
  const { offer, likeId, setLikeId } = props
  const { showMessage } = useMessage()

  const onClickLike = () => {
    createLike({ offerId: offer.id })
      .then((response) => {
        setLikeId(response.data.id) // deleteリクエストで使用するurl: /wants/:idに使用
        showMessage({ message: `${offer.bean.name}をお気に入りに追加しました`, type: 'success' })
      })
      .catch(() => {
        showMessage({ message: 'お気に入りに失敗しました', type: 'error' })
      })
  }

  const onClickUnLike = () => {
    if (likeId) {
      deleteLike({ id: likeId })
        .then(() => {
          setLikeId(null) // like削除に伴うリセット
          showMessage({ message: `${offer.bean.name}をお気に入りから削除しました`, type: 'success' })
        })
        .catch(() => {
          showMessage({ message: 'ライクの削除に失敗しました', type: 'error' })
        })
    }
  }

  return (
    <div className="relative w-14 text-center">
      {likeId ? (
        <button type="button" onClick={onClickUnLike}>
          <svg className="w-10 h-10 text-pink-500">
            <use xlinkHref="#heart-solid" />
          </svg>
        </button>
      ) : (
        <button type="button" onClick={onClickLike}>
          <svg className="w-10 h-10 mx-auto text-pink-600">
            <use xlinkHref="#heart" />
          </svg>
        </button>
      )}
      <p className="absolute -bottom-2 inset-x-0 text-xs tracking-tighter">{likeId ? 'ライク中' : 'ライク'}</p>
    </div>
  )
})
