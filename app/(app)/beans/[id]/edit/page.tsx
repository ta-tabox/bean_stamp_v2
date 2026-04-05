import { BeanFormPageContent } from "@/features/beans/components/BeansPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { updateBeanAction } from "@/server/beans/actions"
import { getBeanForRoaster } from "@/server/beans"

type BeanEditPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function BeanEditPage({ params, searchParams }: BeanEditPageProps) {
  const session = await requireRoasterMembership()
  const { id } = await params
  const currentParams = (await searchParams) ?? {}
  const bean = await getBeanForRoaster(session.roasterId!, id)

  return (
    <BeanFormPageContent
      action={updateBeanAction}
      bean={bean}
      error={currentParams.error}
      submitLabel="更新する"
      title="コーヒー豆編集"
    />
  )
}
