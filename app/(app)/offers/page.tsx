import { OffersListPageContent } from "@/features/offers/components/OffersPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { getOfferStatsForRoaster, listOffersForRoaster } from "@/server/offers"

type OffersPageProps = {
  searchParams?: Promise<{
    deleted?: string
    status?: string
  }>
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const session = await requireRoasterMembership()
  const params = (await searchParams) ?? {}
  const [offers, stats] = await Promise.all([
    listOffersForRoaster(session.roasterId!, session.id, params.status),
    getOfferStatsForRoaster(session.roasterId!),
  ])

  return (
    <OffersListPageContent
      deleted={params.deleted === "1"}
      offers={offers}
      stats={stats}
      statusFilter={params.status}
    />
  )
}
