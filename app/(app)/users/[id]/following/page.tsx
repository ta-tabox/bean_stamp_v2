import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { usersRoutes } from "@/features/users"

type UserFollowingPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function UserFollowingPage({ params }: UserFollowingPageProps) {
  const { id } = await params

  return (
    <PlaceholderPage
      eyebrow="Users"
      title={`フォロー一覧 #${id}`}
      description="ユーザーがフォローしているロースター一覧のルートです。"
      links={usersRoutes}
    />
  )
}
