import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { roastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth/guards"

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
