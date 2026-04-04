import { RoasterFollowerPageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireSession } from "@/server/auth/guards"
import { getRoasterProfile, listRoasterFollowers } from "@/server/profiles/service"

type RoasterFollowerPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function RoasterFollowerPage({ params }: RoasterFollowerPageProps) {
  const { id } = await params
  const session = await requireSession()
  const [roaster, followers] = await Promise.all([
    getRoasterProfile(id, session.id),
    listRoasterFollowers(id),
  ])

  return (
    <RoasterFollowerPageContent
      canEdit={session.roasterId === id}
      followers={followers}
      roaster={roaster}
    />
  )
}
