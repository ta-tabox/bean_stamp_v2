import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { SecondaryButton } from '@/components/Elements/Button'
import { Card } from '@/components/Elements/Card'
import { BeanDetail, BeanThumbnail } from '@/features/beans'
import { OfferPricePerWeight } from '@/features/offers/components/molecules/OfferPricePerWeight'
import { OfferSchedule } from '@/features/offers/components/molecules/OfferSchedule'
import { OfferStatusTag } from '@/features/offers/components/molecules/OfferStatusTag'
import { OfferWantedUserStats } from '@/features/offers/components/molecules/OfferWantedUserStats'
import type { Offer } from '@/features/offers/types'
import { getNumberOfDaysFromTodayTo } from '@/utils/date'

type Props = {
  offer: Offer
}

export const IndexOfferCard: FC<Props> = (props) => {
  const { offer } = props
  const { id, status, roaster, roastedAt, amount, price, weight, bean, want } = offer

  const navigate = useNavigate()

  const onClickShow = () => {
    navigate(`/offers/${offer.id}`)
  }

  return (
    <Card>
      <div className="px-8">
        <div className="w-11/12 mx-auto">
          <div className="flex justify-center -mt-16 md:justify-end items-end">
            <BeanThumbnail name={bean.name} thumbnailUrl={bean.thumbnailUrl} />
          </div>
          <div className="flex justify-between items-end mb-2">
            <OfferStatusTag status={status} />
            <OfferWantedUserStats offerId={id} roasterId={roaster.id} count={want.count} amount={amount} />
          </div>
          {status === 'on_offering' && (
            <p className="text-right text-gray-400">{`焙煎まであと${getNumberOfDaysFromTodayTo(roastedAt)}日です`}</p>
          )}
          <div className="md:flex items-baseline">
            <h1 className="md:mt-2 text-xl lg:text-2xl font-medium text-gray-800 lg:mt-0">{bean.name}</h1>
            <div className="md:ml-4 text-right">
              <SecondaryButton onClick={onClickShow}>
                <div className="w-16 md:w-auto">詳細</div>
              </SecondaryButton>
            </div>
          </div>
        </div>
        <div className="mt-4 lg:grid content-between grid-cols-2">
          {/* NOTE モバイルで見にくいのでタブ表示にしてもいいかも */}
          <BeanDetail bean={bean} />
          <OfferSchedule offer={offer} />
          <div className="col-span-2 w-11/12 lg:w-full mx-auto pr-2 flex justify-end">
            <OfferPricePerWeight price={price} weight={weight} />
          </div>
        </div>
      </div>
    </Card>
  )
}
