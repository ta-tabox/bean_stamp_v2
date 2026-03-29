import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { roastersRoutes } from "@/features/roasters"

export default function RoasterEditPage() {
  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースター編集"
      description="ロースター情報編集のルートです。"
      links={roastersRoutes}
    />
  )
}
