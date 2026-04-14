import { WantDetailPageContent } from "@/features/wants/components/WantsPageContents"
import { requireSession } from "@/server/auth/guards"
import { getWantForUser } from "@/server/wants"

type WantPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function WantPage({ params }: WantPageProps) {
  const session = await requireSession()
  const { id } = await params
  const want = await getWantForUser(session.id, id)

  return (
    <WantDetailPageContent
      canInteract={session.roasterId !== String(want.offer.roaster.id)}
      want={want}
    />
  )
}
