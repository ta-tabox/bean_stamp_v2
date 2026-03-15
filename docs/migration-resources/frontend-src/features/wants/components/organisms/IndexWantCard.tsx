import type { FC } from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { SecondaryButton } from '@/components/Elements/Button'
import { Card } from '@/components/Elements/Card'
import { BeanImagesSwiper, BeanTasteTags } from '@/features/beans'
import { LikeUnLikeButton } from '@/features/likes'
import { OfferContentTab, OfferPricePerWeight, OfferStatusTag, OfferWantedUserStats } from '@/features/offers'
import { RoasterNameLink, RoasterThumbnail, useCurrentRoaster } from '@/features/roasters'
import { WantReceiptedTag } from '@/features/wants/components/molecules/WantReceiptedTag'
import { WantUnWantButton } from '@/features/wants/components/molecules/WantUnWantButton'
import type { Want } from '@/features/wants/types'
import { isAfterReceiptStartedAt } from '@/features/wants/utils/isAfterReceiptStartedAt'
import { getNumberOfDaysFromTodayTo } from '@/utils/date'

type Props = {
  want: Want
}

export const IndexWantCard: FC<Props> = (props) => {
  const { want } = props
  const { offer } = want
  const { status, receiptStartedAt, amount, price, weight, bean, roaster, like } = offer

  const navigate = useNavigate()
  const { currentRoaster } = useCurrentRoaster()

  const [wantId, setWantId] = useState<number | null>(want.id || null)
  const [likeId, setLikeId] = useState<number | null>(like.id || null)
  const [wantCount, setWantCount] = useState<number>(offer.want.count)

  const onClickShow = () => {
    if (wantId) {
      navigate(`/wants/${wantId}`)
    } else {
      navigate(`/offers/${offer.id}`)
    }
  }

  return (
    <Card>
      <section>
        <div className="w-11/12 mb-2 mx-auto">
          <div className="flex justify-center -mt-16 lg:justify-end">
            <Link to={`/roasters/${roaster.id}`}>
              <RoasterThumbnail name={roaster.name} thumbnailUrl={roaster.thumbnailUrl} />
            </Link>
          </div>

          <div className="flex justify-between items-start my-1">
            {isAfterReceiptStartedAt({ offer }) && <WantReceiptedTag isReceipted={!!want.receiptedAt} />}
            <div className="w-2/3 md:w-1/3 ml-auto">
              <RoasterNameLink id={roaster.id} name={roaster.name} />
            </div>
          </div>
          <div className="flex justify-start items-start mt-1 mb-2 space-x-1">
            <OfferStatusTag status={status} />
            <BeanTasteTags tastes={bean.taste.names} />
          </div>
          {status === 'end_of_sales' ||
            (status === 'on_selling' ? null : (
              <p className="text-right text-gray-400">{`受け取り開始日まであと${getNumberOfDaysFromTodayTo(
                receiptStartedAt
              )}日です`}</p>
            ))}

          <div className="md:flex items-center pt-1">
            <h1 className="text-xl md:text-2xl title-font text-gray-800">{bean.name}</h1>
            <div className="md:ml-4 text-right">
              <SecondaryButton onClick={onClickShow} sizeClass="w-20 md:w-16">
                詳細
              </SecondaryButton>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex space-x-1">
              {roaster.id !== currentRoaster?.id && (
                <>
                  <WantUnWantButton
                    offer={offer}
                    wantId={wantId}
                    setWantId={setWantId}
                    wantCount={wantCount}
                    setWantCount={setWantCount}
                  />
                  <LikeUnLikeButton offer={offer} likeId={likeId} setLikeId={setLikeId} />
                </>
              )}
            </div>
            <div className="mr-4">
              <OfferWantedUserStats offerId={offer.id} roasterId={roaster.id} count={wantCount} amount={amount} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-11/12 mx-auto flex flex-wrap mt-4">
          <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
            {/* タブコンテンツ */}
            <OfferContentTab offer={offer} />

            {/* 価格 */}
            <div className="pt-4 flex justify-end">
              <OfferPricePerWeight price={price} weight={weight} />
            </div>
          </div>

          {/* 画像  */}
          <div className="w-full lg:w-1/2 h-64 md:h-96 mt-auto">
            <BeanImagesSwiper beanName={bean.name} imageUrls={bean.imageUrls} />
          </div>
        </div>
      </section>
    </Card>
  )
}
