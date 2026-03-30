import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { roastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth"

export default async function RoasterCancelPage() {
  await requireRoasterMembership()

  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースター終了"
      description="ロースター停止・削除系の UI を置くルートです。"
      links={roastersRoutes}
    />
  )
}
