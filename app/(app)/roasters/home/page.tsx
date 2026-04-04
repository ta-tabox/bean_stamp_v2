import {
  RoasterHomeMissingContent,
  RoastersHomePageContent,
} from "@/features/home/components/HomePageContents"
import { requireSession } from "@/server/auth/guards"
import { listCurrentOffersForRoasterHome } from "@/server/home/service"
import { getRoasterProfile } from "@/server/profiles/service"

type RoastersHomePageProps = {
  searchParams?: Promise<{
    deleted?: string
  }>
}

export default async function RoastersHomePage({ searchParams }: RoastersHomePageProps) {
  const session = await requireSession()
  const params = (await searchParams) ?? {}
  const roaster = session.roasterId ? await getRoasterProfile(session.roasterId, session.id) : null
  const offers = session.roasterId ? await listCurrentOffersForRoasterHome(session.roasterId) : []

  if (!roaster) {
    return <RoasterHomeMissingContent />
  }

  return (
    <RoastersHomePageContent
      deleted={params.deleted === "1"}
      offers={offers}
      roasterName={roaster.name}
    />
  )
}
