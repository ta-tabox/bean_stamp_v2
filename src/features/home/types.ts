export type HomeOfferStatus =
  | "end_of_sales"
  | "on_offering"
  | "on_preparing"
  | "on_roasting"
  | "on_selling"

export type HomeOfferSummary = {
  beanImageUrl: string | null
  beanName: string
  countryName: string
  id: string
  price: number
  process: string
  roastLevelName: string
  roasterId: string
  roasterImageUrl: string | null
  roasterName: string
  status: HomeOfferStatus
  wantsCount: number
  weight: number
}
