import { SearchPageContent } from "@/features/search"
import { requireSession } from "@/server/auth/guards"

export default async function SearchPage() {
  await requireSession()

  return (
    <SearchPageContent
      currentTab="roasters"
      showResults={false}
    />
  )
}
