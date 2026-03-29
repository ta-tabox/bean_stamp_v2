import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { searchRoutes } from "@/features/search"

export default function SearchRoastersPage() {
  return (
    <PlaceholderPage
      eyebrow="Search"
      title="ロースター検索"
      description="ロースター一覧検索のルートです。"
      links={searchRoutes}
    />
  )
}
