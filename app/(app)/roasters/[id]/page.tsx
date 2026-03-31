import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { roastersRoutes } from "@/features/roasters"

type RoasterPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function RoasterPage({ params }: RoasterPageProps) {
  const { id } = await params

  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title={`ロースター詳細 #${id}`}
      description="ロースター詳細ページです。Bean と Offer への導線はこの画面から展開します。"
      links={roastersRoutes}
    />
  )
}
