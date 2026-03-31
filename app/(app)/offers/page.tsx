import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { offersRoutes } from "@/features/offers"

export default function OffersPage() {
  return (
    <PlaceholderPage
      eyebrow="Offers"
      title="オファー一覧"
      description="Offer 一覧と検索結果導線の基点です。"
      links={offersRoutes}
    />
  )
}
