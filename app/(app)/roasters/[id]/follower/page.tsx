import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { roastersRoutes } from "@/features/roasters"

type RoasterFollowerPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function RoasterFollowerPage({ params }: RoasterFollowerPageProps) {
  const { id } = await params

  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title={`フォロワー一覧 #${id}`}
      description="旧ルーティングの follower/followers 文脈を吸収する一覧ルートです。"
      links={roastersRoutes}
    />
  )
}
