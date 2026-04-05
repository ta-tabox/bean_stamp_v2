import { UsersHomePageContent } from "@/features/home/components/HomePageContents"
import { requireSession } from "@/server/auth/guards"
import { listCurrentOffersForUserHome } from "@/server/home/service"
import { getUserProfile } from "@/server/profiles/service"

export default async function UsersHomePage() {
  const session = await requireSession()
  const user = await getUserProfile(session.id)
  const offers = await listCurrentOffersForUserHome(session.id)

  return (
    <UsersHomePageContent
      offers={offers}
      userName={user.name}
    />
  )
}
