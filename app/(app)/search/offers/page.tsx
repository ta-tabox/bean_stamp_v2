import { SearchPageContent, mapOfferToHomeOfferSummary } from "@/features/search"
import { requireSession } from "@/server/auth/guards"
import { searchOffers } from "@/server/search"

type SearchOffersPageProps = Readonly<{
  searchParams?: Promise<{
    country_id?: string
    page?: string
    prefecture_code?: string | string[]
    roast_level_id?: string
    taste_tag_id?: string
  }>
}>

export default async function SearchOffersPage({ searchParams }: SearchOffersPageProps) {
  const session = await requireSession()
  const currentParams = (await searchParams) ?? {}
  const result = await searchOffers(
    {
      countryId: currentParams.country_id,
      page: currentParams.page,
      prefectureCodes: readSearchParamArray(currentParams.prefecture_code),
      roastLevelId: currentParams.roast_level_id,
      tasteTagId: currentParams.taste_tag_id,
    },
    session.id,
  )

  return (
    <SearchPageContent
      currentPage={result.pagination.currentPage}
      currentRoasterId={session.roasterId}
      currentTab="offers"
      offers={result.items.map(mapOfferToHomeOfferSummary)}
      searchParams={{
        countryId: currentParams.country_id,
        prefectureCodes: readSearchParamArray(currentParams.prefecture_code),
        roastLevelId: currentParams.roast_level_id,
        tasteTagId: currentParams.taste_tag_id,
      }}
      totalPages={result.pagination.totalPages}
    />
  )
}

function readSearchParamArray(value?: string | string[]) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}
