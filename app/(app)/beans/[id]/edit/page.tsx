import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { beansRoutes } from "@/features/beans"
import { requireRoasterMembership } from "@/server/auth/guards"

type BeanEditPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function BeanEditPage({ params }: BeanEditPageProps) {
  await requireRoasterMembership()
  const { id } = await params

  return (
    <PlaceholderPage
      eyebrow="Beans"
      title={`豆編集 #${id}`}
      description="Bean 編集画面のルートです。"
      links={beansRoutes}
    />
  )
}
