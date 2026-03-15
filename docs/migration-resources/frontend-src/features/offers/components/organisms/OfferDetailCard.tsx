import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/Elements/Card'
import { LikeUnLikeButton } from '@/features/likes'
import { OfferPricePerWeight } from '@/features/offers/components/molecules/OfferPricePerWeight'
import { OfferSchedule } from '@/features/offers/components/molecules/OfferSchedule'
import { OfferStatusTag } from '@/features/offers/components/molecules/OfferStatusTag'
import { OfferWantedUserStats } from '@/features/offers/components/molecules/OfferWantedUserStats'
import type { Offer } from '@/features/offers/types'
import { RoasterNameLink, RoasterThumbnail, useCurrentRoaster } from '@/features/roasters'
import { WantUnWantButton } from '@/features/wants'

type Props = {
  offer: Offer
}

export const OfferDetailCard: FC<Props> = (props) => {
  const { offer } = props
  const { id, status, amount, price, weight, roaster, want, like } = offer
  const { currentRoaster } = useCurrentRoaster()

  const [wantId, setWantId] = useState<number | null>(want.id || null)
  const [likeId, setLikeId] = useState<number | null>(like.id || null)
  const [wantCount, setWantCount] = useState<number>(want.count)

  // offerが変わった際にウォントとライクの情報を更新する
  useEffect(() => {
    setWantId(want.id || null)
    setLikeId(like.id || null)
    setWantCount(want.count)
  }, [offer])

  return (
    <Card>
      <div className="px-8">
        <div className="w-11/12 mx-auto">
          <div className="flex justify-center -mt-16 md:justify-end">
            <Link to={`/roasters/${roaster.id}`}>
              <RoasterThumbnail name={roaster.name} thumbnailUrl={roaster.thumbnailUrl} />
            </Link>
          </div>
          <div className="flex justify-between mb-2">
            <OfferStatusTag status={status} />
            <div className="w-2/3 md:w-1/3 ml-auto">
              <RoasterNameLink id={roaster.id} name={roaster.name} />
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
        <div className="mt-4 lg:grid content-between grid-cols-2">
          <OfferSchedule offer={offer} />
          <div className="col-span-2 w-11/12 lg:w-full mx-auto pr-2 flex justify-end">
            <OfferPricePerWeight price={price} weight={weight} />
          </div>
        </div>
      </div>
    </Card>
  )
}
