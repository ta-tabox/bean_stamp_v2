import { OfferWantedUsersPageContent } from "@/features/offers/components/OffersPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { getOfferForViewer, listWantedUsersForOffer } from "@/server/offers"

type WantedUsersPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function WantedUsersPage({ params }: WantedUsersPageProps) {
  const session = await requireRoasterMembership()
  const { id } = await params
  const [offer, users] = await Promise.all([
    getOfferForViewer(id, session.id),
    listWantedUsersForOffer(session.roasterId!, id),
  ])

  return <OfferWantedUsersPageContent offer={offer} users={users} />
}
