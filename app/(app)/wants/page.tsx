import { WantsListPageContent } from "@/features/wants/components/WantsPageContents"
import { requireSession } from "@/server/auth/guards"
import { listWantsForUser } from "@/server/wants"

type WantsPageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function WantsPage({ searchParams }: WantsPageProps) {
  const session = await requireSession()
  const params = (await searchParams) ?? {}
  const wants = await listWantsForUser(session.id, params.status)

  return (
    <WantsListPageContent
      currentRoasterId={session.roasterId}
      statusFilter={params.status}
      wants={wants}
    />
  )
}
