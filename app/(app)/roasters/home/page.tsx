import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { roastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth"

export default async function RoastersHomePage() {
  await requireRoasterMembership()

  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースターホーム"
      description="所属ロースター向けのダッシュボード配置を想定したルートです。"
      links={roastersRoutes}
    />
  )
}
