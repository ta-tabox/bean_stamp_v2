import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { roastersRoutes } from "@/features/roasters"
import { requireNoRoasterMembership } from "@/server/auth/guards"

export default async function RoasterNewPage() {
  await requireNoRoasterMembership()

  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースター新規作成"
      description="ロースター登録フォームの受け皿です。"
      links={roastersRoutes}
    />
  )
}
