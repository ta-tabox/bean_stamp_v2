import { UserFollowingPageContent } from "@/features/profiles/components/ProfilePageContents"
import { getSessionPrincipal } from "@/server/auth/guards"
import { getUserProfile, listRoastersFollowedByUser } from "@/server/profiles/service"

type UserFollowingPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function UserFollowingPage({ params }: UserFollowingPageProps) {
  const { id } = await params
  const currentUser = await getSessionPrincipal()
  const [user, roasters] = await Promise.all([getUserProfile(id), listRoastersFollowedByUser(id)])

  return (
    <UserFollowingPageContent
      canEdit={currentUser?.id === id}
      roasters={roasters}
      user={user}
    />
  )
}
