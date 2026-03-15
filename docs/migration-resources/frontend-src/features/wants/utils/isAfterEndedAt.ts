import type { Offer } from '@/features/offers'

type Options = {
  offer: Offer
}

export const isAfterEndedAt = ({ offer }: Options) => {
  const now = new Date()
  const rowDate = new Date(offer.endedAt)
  const [year, month, date] = [rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()]

  // endedAtは日付データのため、その日の終わりを設定
  const endedAt = new Date(year, month, date, 23, 59, 59, 99)

  return now > endedAt
}
