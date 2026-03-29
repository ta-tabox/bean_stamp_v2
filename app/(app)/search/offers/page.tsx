import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { searchRoutes } from "@/features/search"

export default function SearchOffersPage() {
  return (
    <PlaceholderPage
      eyebrow="Search"
      title="オファー検索"
      description="オファー検索結果一覧を表示するルートです。"
      links={searchRoutes}
    />
  )
}
