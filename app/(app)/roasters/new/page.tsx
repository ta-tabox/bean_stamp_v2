import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { roastersRoutes } from "@/features/roasters"

export default function RoasterNewPage() {
  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースター新規作成"
      description="ロースター登録フォームの受け皿です。"
      links={roastersRoutes}
    />
  )
}
