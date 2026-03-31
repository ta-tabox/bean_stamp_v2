import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { beansRoutes } from "@/features/beans"
import { requireRoasterMembership } from "@/server/auth"

export default async function BeanNewPage() {
  await requireRoasterMembership()

  return (
    <PlaceholderPage
      eyebrow="Beans"
      title="豆新規作成"
      description="豆登録フォームの実装先です。"
      links={beansRoutes}
    />
  )
}
