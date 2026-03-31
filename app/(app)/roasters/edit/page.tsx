import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { roastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth/guards"

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
