import { BeanDetailPageContent } from "@/features/beans/components/BeansPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { deleteBeanAction } from "@/server/beans/actions"
import { getBeanForRoaster } from "@/server/beans"

type BeanPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    created?: string
    error?: string
    updated?: string
  }>
}

export default async function BeanPage({ params, searchParams }: BeanPageProps) {
  const session = await requireRoasterMembership()
  const { id } = await params
  const currentParams = (await searchParams) ?? {}
  const bean = await getBeanForRoaster(session.roasterId!, id)

  return (
    <BeanDetailPageContent
      bean={bean}
      deleteAction={deleteBeanAction}
      status={{
        created: currentParams.created === "1",
        error: currentParams.error,
        updated: currentParams.updated === "1",
      }}
    />
  )
}
