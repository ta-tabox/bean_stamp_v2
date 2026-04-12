import { notFound } from "next/navigation"

import { OfferFormPageContent } from "@/features/offers/components/OffersPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { getOfferForViewer, listWritableBeansForRoaster } from "@/server/offers"

type OfferEditPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function OfferEditPage({ params, searchParams }: OfferEditPageProps) {
  const session = await requireRoasterMembership()
  const { id } = await params
  const currentParams = (await searchParams) ?? {}
  const [offer, beans] = await Promise.all([
    getOfferForViewer(id, session.id),
    listWritableBeansForRoaster(session.roasterId!),
  ])

  if (session.roasterId !== String(offer.roaster.id)) {
    notFound()
  }

  return (
    <OfferFormPageContent
      beans={beans}
      error={currentParams.error}
      offer={offer}
      submitLabel="更新する"
      title="オファー編集"
    />
  )
}
