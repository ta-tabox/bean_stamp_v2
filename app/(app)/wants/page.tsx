import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { wantsRoutes } from "@/features/wants"

export default function WantsPage() {
  return (
    <PlaceholderPage
      eyebrow="Wants"
      title="Want 一覧"
      description="応募履歴と評価状態をまとめるルートです。"
      links={wantsRoutes}
    />
  )
}
