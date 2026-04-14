import { UserFollowingPageContent } from "@/features/profiles/components/ProfilePageContents"
import { listRoastersFollowedByUser } from "@/server/profiles/service"

type UserFollowingPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function UserFollowingPage({ params }: UserFollowingPageProps) {
  const { id } = await params
  const roasters = await listRoastersFollowedByUser(id)

  return <UserFollowingPageContent roasters={roasters} />
}
