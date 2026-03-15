import type { FC } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { SecondaryButton } from '@/components/Elements/Button'
import { Card } from '@/components/Elements/Card'
import { BeanImagesSwiper, BeanTasteTags } from '@/features/beans'
import { LikeUnLikeButton } from '@/features/likes'
import { OfferContentTab } from '@/features/offers/components/molecules/OfferContentTab'
import { OfferPricePerWeight } from '@/features/offers/components/molecules/OfferPricePerWeight'
import { OfferStatusTag } from '@/features/offers/components/molecules/OfferStatusTag'
import { OfferWantedUserStats } from '@/features/offers/components/molecules/OfferWantedUserStats'
import type { Offer } from '@/features/offers/types'
import { RoasterNameLink, RoasterThumbnail, useCurrentRoaster } from '@/features/roasters'
import { WantUnWantButton } from '@/features/wants'

type Props = {
  offer: Offer
}

export const OfferContentCard: FC<Props> = (props) => {
  const { offer } = props
  const { id, status, amount, price, weight, bean, roaster, want, like } = offer
  const navigate = useNavigate()

  const { currentRoaster } = useCurrentRoaster()

  const [wantId, setWantId] = useState<number | null>(want.id || null)
  const [likeId, setLikeId] = useState<number | null>(like.id || null)
  const [wantCount, setWantCount] = useState<number>(want.count)

  const onClickShow = () => {
    navigate(`/offers/${offer.id}`)
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

          <div className="flex justify-end items-start my-1">
            <div className="w-2/3 md:w-1/3 ml-auto">
              <RoasterNameLink id={roaster.id} name={roaster.name} />
            </div>
          </div>
          <div className="flex justify-start items-start mt-1 mb-2 space-x-1">
            <OfferStatusTag status={status} />
            <BeanTasteTags tastes={bean.taste.names} />
          </div>

          <div className="md:flex items-center">
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
              <OfferWantedUserStats offerId={id} roasterId={roaster.id} count={wantCount} amount={amount} />
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
