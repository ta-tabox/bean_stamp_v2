import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { offersRoutes } from "@/features/offers"
import { requireRoasterMembership } from "@/server/auth/guards"

type WantedUsersPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function WantedUsersPage({ params }: WantedUsersPageProps) {
  await requireRoasterMembership()
  const { id } = await params

  return (
    <PlaceholderPage
      eyebrow="Offers"
      title={`応募ユーザー一覧 #${id}`}
      description="Offer に対して Want 済みのユーザー一覧を表示するルートです。"
      links={offersRoutes}
    />
  )
}
