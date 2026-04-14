import { LikesPageContent } from "@/features/likes/components/LikesPageContents"
import { requireSession } from "@/server/auth/guards"
import { listLikesForUser } from "@/server/likes"

type LikesPageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function LikesPage({ searchParams }: LikesPageProps) {
  const session = await requireSession()
  const params = (await searchParams) ?? {}
  const likes = await listLikesForUser(session.id, params.status)

  return (
    <LikesPageContent
      currentRoasterId={session.roasterId}
      likes={likes}
      statusFilter={params.status}
    />
  )
}
