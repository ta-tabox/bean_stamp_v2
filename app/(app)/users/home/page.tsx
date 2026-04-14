import { UsersHomePageContent } from "@/features/home/components/HomePageContents"
import { mapOfferToHomeOfferSummary } from "@/features/search"
import { requireSession } from "@/server/auth/guards"
import { listCurrentOffersForUserHome } from "@/server/home/service"
import { getUserProfile } from "@/server/profiles/service"
import { listRecommendedOffersForUser } from "@/server/search"

export default async function UsersHomePage() {
  const session = await requireSession()
  const [user, offers, recommendedOffers] = await Promise.all([
    getUserProfile(session.id),
    listCurrentOffersForUserHome(session.id),
    listRecommendedOffersForUser(session.id),
  ])

  return (
    <UsersHomePageContent
      currentRoasterId={session.roasterId}
      offers={offers}
      recommendedOffers={recommendedOffers.map(mapOfferToHomeOfferSummary)}
      userName={user.name}
    />
  )
}
