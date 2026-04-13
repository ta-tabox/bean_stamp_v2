import { OfferFormPageContent } from "@/features/offers/components/OffersPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { listWritableBeansForRoaster } from "@/server/offers"

type OfferNewPageProps = {
  searchParams?: Promise<{
    beanId?: string
    error?: string
  }>
}

export default async function OfferNewPage({ searchParams }: OfferNewPageProps) {
  const session = await requireRoasterMembership()
  const params = (await searchParams) ?? {}
  const beans = await listWritableBeansForRoaster(session.roasterId!)

  return (
    <OfferFormPageContent
      beans={beans}
      defaultBeanId={params.beanId}
      error={params.error}
      submitLabel="保存する"
      title="オファー登録"
    />
  )
}
