import { BeansListPageContent } from "@/features/beans/components/BeansPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { listBeansForRoaster } from "@/server/beans"

type BeansPageProps = {
  searchParams?: Promise<{
    deleted?: string
  }>
}

export default async function BeansPage({ searchParams }: BeansPageProps) {
  const session = await requireRoasterMembership()
  const params = (await searchParams) ?? {}
  const beans = await listBeansForRoaster(session.roasterId!)

  return (
    <BeansListPageContent
      beans={beans}
      deleted={params.deleted === "1"}
    />
  )
}
