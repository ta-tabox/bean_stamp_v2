import type { Offer } from '@/features/offers'

type Options = {
  offer: Offer
}

export const isAfterReceiptStartedAt = ({ offer }: Options) => {
  const now = new Date()
  const rowDate = new Date(offer.receiptStartedAt)
  const [year, month, date] = [rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()]
  // 受け取り開始日は日時データ, hour以下設定なしで00:00:00が設定される
  const receiptStartedAt = new Date(year, month, date)

  return now >= receiptStartedAt
}
