import type { Bean } from '@/features/beans'
import type { Roaster } from '@/features/roasters'

export type Offer = {
  id: number
  beanId: number
  price: number
  weight: number
  amount: number
  endedAt: string
  roastedAt: string
  receiptStartedAt: string
  receiptEndedAt: string
  status: OfferStatus
  createdAt: string
  roaster: Pick<Roaster, 'id' | 'name' | 'thumbnailUrl'>
  bean: Bean
  want: {
    count: number
    isWanted: boolean
    id?: number
  }
  like: {
    isLiked: boolean
    id?: number
  }
}

export type OfferStatus = 'on_offering' | 'on_roasting' | 'on_preparing' | 'on_selling' | 'end_of_sales'

export type OfferCreateUpdateData = Pick<
  Offer,
  'beanId' | 'price' | 'weight' | 'amount' | 'endedAt' | 'roastedAt' | 'receiptStartedAt' | 'receiptEndedAt'
>

export type OffersStats = {
  onOffering: number
  onRoasting: number
  onPreparing: number
  onSelling: number
  endOfSales: number
}
