import { SearchPageContent } from "@/features/search"
import { requireSession } from "@/server/auth/guards"
import { listRoastersBySearch } from "@/server/search"

export default async function SearchPage() {
  await requireSession()
  const result = await listRoastersBySearch({})

  return (
    <SearchPageContent
      currentPage={result.pagination.currentPage}
      currentTab="roasters"
      roasters={result.items}
      totalPages={result.pagination.totalPages}
    />
  )
}
