import { OffersListPageContent } from "@/features/offers/components/OffersPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { listOffersForRoaster } from "@/server/offers"

type OffersPageProps = {
  searchParams?: Promise<{
    deleted?: string
    status?: string
  }>
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const session = await requireRoasterMembership()
  const params = (await searchParams) ?? {}
  const offers = await listOffersForRoaster(session.roasterId!, session.id, params.status)

  return (
    <OffersListPageContent
      deleted={params.deleted === "1"}
      offers={offers}
      statusFilter={params.status}
    />
  )
}
