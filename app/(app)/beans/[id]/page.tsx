import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { beansRoutes } from "@/features/beans"

type BeanPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function BeanPage({ params }: BeanPageProps) {
  const { id } = await params

  return (
    <PlaceholderPage
      eyebrow="Beans"
      title={`豆詳細 #${id}`}
      description="Bean 詳細画面です。画像やテイスト情報は後続 issue で追加します。"
      links={beansRoutes}
    />
  )
}
