import { SearchPageContent } from "@/features/search"
import { requireSession } from "@/server/auth/guards"
import { listRoastersBySearch } from "@/server/search"

type SearchRoastersPageProps = Readonly<{
  searchParams?: Promise<{
    name?: string
    page?: string
    prefecture_code?: string
  }>
}>

export default async function SearchRoastersPage({ searchParams }: SearchRoastersPageProps) {
  await requireSession()
  const currentParams = (await searchParams) ?? {}
  const result = await listRoastersBySearch({
    name: currentParams.name,
    page: currentParams.page,
    prefectureCode: currentParams.prefecture_code,
  })

  return (
    <SearchPageContent
      currentPage={result.pagination.currentPage}
      currentTab="roasters"
      roasters={result.items}
      searchParams={{
        name: currentParams.name,
        prefectureCode: currentParams.prefecture_code,
      }}
      totalPages={result.pagination.totalPages}
    />
  )
}
