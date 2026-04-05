import { RoasterProfilePageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireSession } from "@/server/auth/guards"
import { followRoasterAction, unfollowRoasterAction } from "@/server/profiles/actions"
import { getRoasterProfile } from "@/server/profiles/service"

type RoasterPageProps = Readonly<{
  params: Promise<{ id: string }>
  searchParams?: Promise<{
    created?: string
    followed?: string
    unfollowed?: string
    updated?: string
  }>
}>

export default async function RoasterPage({ params, searchParams }: RoasterPageProps) {
  const { id } = await params
  const session = await requireSession()
  const roaster = await getRoasterProfile(id, session.id)
  const ownRoaster = session.roasterId === id
  const currentParams = (await searchParams) ?? {}

  return (
    <RoasterProfilePageContent
      canEdit={ownRoaster}
      roaster={roaster}
      status={{
        created: currentParams.created === "1",
        updated: currentParams.updated === "1",
        followed: currentParams.followed === "1",
        unfollowed: currentParams.unfollowed === "1",
      }}
      followAction={
        roaster.roaster_relationship_id === null ? (
          <form action={followRoasterAction}>
            <input
              type="hidden"
              name="roasterId"
              value={roaster.id}
            />
            <button
              type="submit"
              className="btn btn-primary"
            >
              フォローする
            </button>
          </form>
        ) : (
          <form action={unfollowRoasterAction}>
            <input
              type="hidden"
              name="relationshipId"
              value={roaster.roaster_relationship_id}
            />
            <input
              type="hidden"
              name="roasterId"
              value={roaster.id}
            />
            <button
              type="submit"
              className="btn btn-secondary"
            >
              フォロー解除
            </button>
          </form>
        )
      }
    />
  )
}
