import { OfferDetailPageContent } from "@/features/offers/components/OffersPageContents"
import { requireSession } from "@/server/auth/guards"
import { getOfferForViewer } from "@/server/offers"

type OfferPageProps = Readonly<{
  params: Promise<{ id: string }>
  searchParams?: Promise<{
    created?: string
    error?: string
    updated?: string
  }>
}>

export default async function OfferPage({ params, searchParams }: OfferPageProps) {
  const session = await requireSession()
  const { id } = await params
  const currentParams = (await searchParams) ?? {}
  const offer = await getOfferForViewer(id, session.id)

  return (
    <OfferDetailPageContent
      canManage={session.roasterId === String(offer.roaster.id)}
      offer={offer}
      status={{
        created: currentParams.created === "1",
        error: currentParams.error,
        updated: currentParams.updated === "1",
      }}
    />
  )
}
