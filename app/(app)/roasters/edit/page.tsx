import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { roastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth"

export default async function RoasterEditPage() {
  await requireRoasterMembership()

  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースター編集"
      description="ロースター情報編集のルートです。"
      links={roastersRoutes}
    />
  )
}
