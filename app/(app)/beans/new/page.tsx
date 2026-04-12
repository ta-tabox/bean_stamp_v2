import { BeanFormPageContent } from "@/features/beans/components/BeansPageContents"
import { requireRoasterMembership } from "@/server/auth/guards"

type BeanNewPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function BeanNewPage({ searchParams }: BeanNewPageProps) {
  await requireRoasterMembership()
  const params = (await searchParams) ?? {}

  return (
    <BeanFormPageContent
      error={params.error}
      submitLabel="保存する"
      title="コーヒー豆登録"
    />
  )
}
