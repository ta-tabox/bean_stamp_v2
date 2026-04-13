export type HomeOfferStatus =
  | "end_of_sales"
  | "on_offering"
  | "on_preparing"
  | "on_roasting"
  | "on_selling"

export type HomeOfferSummary = {
  acidity: number
  amount: number
  beanImageUrl: string | null
  beanName: string
  bitterness: number
  body: number
  countryName: string
  createdAt: string
  endedAt: string
  flavor: number
  id: string
  price: number
  process: string
  receiptEndedAt: string
  receiptStartedAt: string
  roastLevelName: string
  roastedAt: string
  roasterId: string
  roasterImageUrl: string | null
  roasterName: string
  status: HomeOfferStatus
  sweetness: number
  tasteNames: string[]
  wantsCount: number
  weight: number
}
