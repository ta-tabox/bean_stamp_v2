import Link from "next/link"

import { HomeOfferCard } from "@/components/home/HomeUi"
import { ContentHeader } from "@/components/layout/ContentHeader"
import { ProfileListItemLink, ProfileListSection } from "@/components/profiles/ProfileUi"
import { prefectureOptions, resolvePrefectureLabel } from "@/components/shared/prefecture-label"
import type { HomeOfferSummary } from "@/features/home/types"
import { SearchPrefectureMultiSelect } from "@/features/search/components/SearchPrefectureMultiSelect"
import { countriesSeedData, roastLevelsSeedData, tasteTagsSeedData } from "@/server/db/seed-data"
import type { RoasterApiResponse } from "@/server/profiles/dto"

type SearchPageContentProps = {
  currentPage?: number
  currentRoasterId?: string | null
  currentTab: "offers" | "roasters"
  offers?: readonly HomeOfferSummary[]
  roasters?: readonly RoasterApiResponse[]
  searchParams?: {
    countryId?: string
    name?: string
    prefectureCodes?: string[]
    roastLevelId?: string
    tasteTagId?: string
  }
  showResults?: boolean
  totalPages?: number
}

const countryOptions = countriesSeedData.filter((country) => country.id > 0)
const roastLevelOptions = roastLevelsSeedData.filter((roastLevel) => roastLevel.id > 0)
const tasteTagOptions = tasteTagsSeedData.filter((tasteTag) => tasteTag.id > 0)

export function SearchPageContent({
  currentPage = 1,
  currentRoasterId,
  currentTab,
  offers = [],
  roasters = [],
  searchParams,
  showResults = true,
  totalPages = 1,
}: SearchPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="探す" />

      <section className="page-card">
        <div className="search-tab-list">
          <SearchTabLink
            active={currentTab === "roasters"}
            href="/search/roasters"
            label="Roaster"
          />
          <SearchTabLink
            active={currentTab === "offers"}
            href="/search/offers"
            label="Offer"
          />
        </div>

        <div className="mt-8">
          {currentTab === "roasters" ? (
            <RoasterSearchForm
              name={searchParams?.name ?? ""}
              prefectureCodes={searchParams?.prefectureCodes ?? []}
            />
          ) : (
            <OfferSearchForm
              countryId={searchParams?.countryId ?? ""}
              prefectureCodes={searchParams?.prefectureCodes ?? []}
              roastLevelId={searchParams?.roastLevelId ?? ""}
              tasteTagId={searchParams?.tasteTagId ?? ""}
            />
          )}
        </div>
      </section>

      {showResults ? (
        currentTab === "roasters" ? (
          <ProfileListSection
            title="ロースター検索結果"
            hasItems={roasters.length > 0}
            emptyTitle="ロースターが見つかりませんでした"
            emptyDescription="検索条件を変えてお試しください。"
          >
            {roasters.map((roaster) => (
              <ProfileListItemLink
                key={roaster.id}
                badge={resolvePrefectureLabel(roaster.prefecture_code)}
                description={roaster.describe ?? "ロースター紹介はまだありません。"}
                href={`/roasters/${roaster.id}`}
                imageUrl={roaster.thumbnail_url}
                placeholder="roaster"
                subtitle={roaster.address}
                title={roaster.name}
              />
            ))}
          </ProfileListSection>
        ) : (
          <OffersSearchResults
            currentRoasterId={currentRoasterId}
            offers={offers}
          />
        )
      ) : null}

      {showResults && totalPages > 1 ? (
        <SearchPagination
          currentPage={currentPage}
          currentTab={currentTab}
          searchParams={searchParams}
          totalPages={totalPages}
        />
      ) : null}
    </main>
  )
}

function SearchTabLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={active ? "search-tab search-tab-active" : "search-tab"}
    >
      {label}
    </Link>
  )
}

function RoasterSearchForm({ name, prefectureCodes }: { name: string; prefectureCodes: string[] }) {
  return (
    <form
      action="/search/roasters"
      method="get"
      className="space-y-5"
    >
      <SearchField
        label="ロースター名"
        name="name"
        defaultValue={name}
      />
      <SearchPrefectureMultiSelect
        label="都道府県"
        name="prefecture_code"
        defaultValues={prefectureCodes}
        options={prefectureOptions}
      />
      <SearchActions href="/search/roasters" />
    </form>
  )
}

function OfferSearchForm({
  countryId,
  prefectureCodes,
  roastLevelId,
  tasteTagId,
}: {
  countryId: string
  prefectureCodes: string[]
  roastLevelId: string
  tasteTagId: string
}) {
  return (
    <form
      action="/search/offers"
      method="get"
      className="space-y-5"
    >
      <SearchPrefectureMultiSelect
        label="都道府県"
        name="prefecture_code"
        defaultValues={prefectureCodes}
        options={prefectureOptions}
      />
      <SearchSelect
        label="生産国"
        name="country_id"
        defaultValue={countryId}
        options={countryOptions.map((country) => ({
          label: country.name,
          value: String(country.id),
        }))}
      />
      <SearchSelect
        label="焙煎度"
        name="roast_level_id"
        defaultValue={roastLevelId}
        options={roastLevelOptions.map((roastLevel) => ({
          label: roastLevel.name,
          value: String(roastLevel.id),
        }))}
      />
      <SearchSelect
        label="テイストタグ"
        name="taste_tag_id"
        defaultValue={tasteTagId}
        options={tasteTagOptions.map((tasteTag) => ({
          label: tasteTag.name,
          value: String(tasteTag.id),
        }))}
      />
      <SearchActions href="/search/offers" />
    </form>
  )
}

function SearchField({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string
  label: string
  name: string
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-fg)]">
      <span>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="bean-select-input rounded-md border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none"
      />
    </label>
  )
}

function SearchSelect({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string
  label: string
  name: string
  options: ReadonlyArray<{ label: string; value: string }>
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-fg)]">
      <span>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="bean-select-input rounded-md border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none"
      >
        <option value="">選択してください</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SearchActions({ href }: { href: string }) {
  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <Link
        href={href}
        className="btn btn-secondary"
      >
        クリア
      </Link>
      <button
        type="submit"
        className="btn btn-primary"
      >
        検索
      </button>
    </div>
  )
}

function OffersSearchResults({
  currentRoasterId,
  offers,
}: {
  currentRoasterId?: string | null
  offers: readonly HomeOfferSummary[]
}) {
  if (!offers.length) {
    return (
      <section className="page-card">
        <div className="empty-state">
          <h2 className="title-font text-2xl text-[var(--color-fg)]">
            オファーが見つかりませんでした
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">検索条件を変えてお試しください。</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-10">
      <ol>
        {offers.map((offer, index) => (
          <li
            key={offer.id}
            className={index === 0 ? "mt-10" : "mt-20"}
          >
            <HomeOfferCard
              acidity={offer.acidity}
              amount={offer.amount}
              beanImageUrl={offer.beanImageUrl}
              beanName={offer.beanName}
              bitterness={offer.bitterness}
              body={offer.body}
              countryName={offer.countryName}
              createdAt={offer.createdAt}
              endedAt={offer.endedAt}
              flavor={offer.flavor}
              href={`/offers/${offer.id}`}
              id={offer.id}
              initialLikeId={offer.initialLikeId}
              initialWantId={offer.initialWantId}
              price={offer.price}
              process={offer.process}
              receiptEndedAt={offer.receiptEndedAt}
              receiptStartedAt={offer.receiptStartedAt}
              roastLevelName={offer.roastLevelName}
              roastedAt={offer.roastedAt}
              roasterHref={`/roasters/${offer.roasterId}`}
              roasterImageUrl={offer.roasterImageUrl}
              roasterName={offer.roasterName}
              showEngagement={currentRoasterId !== offer.roasterId}
              status={offer.status}
              sweetness={offer.sweetness}
              tasteNames={offer.tasteNames}
              wantsCount={offer.wantsCount}
              weight={offer.weight}
            />
          </li>
        ))}
      </ol>
    </section>
  )
}

function SearchPagination({
  currentPage,
  currentTab,
  searchParams,
  totalPages,
}: {
  currentPage: number
  currentTab: "offers" | "roasters"
  searchParams?: SearchPageContentProps["searchParams"]
  totalPages: number
}) {
  const pages = collectVisiblePages(currentPage, totalPages)

  return (
    <nav
      className="pagination"
      aria-label="検索結果のページ移動"
    >
      <PaginationLink
        currentTab={currentTab}
        disabled={currentPage <= 1}
        page={currentPage - 1}
        searchParams={searchParams}
      >
        {"< Prev"}
      </PaginationLink>
      {pages.map((page) => (
        <PaginationLink
          key={page}
          active={page === currentPage}
          currentTab={currentTab}
          page={page}
          searchParams={searchParams}
        >
          {String(page)}
        </PaginationLink>
      ))}
      <PaginationLink
        currentTab={currentTab}
        disabled={currentPage >= totalPages}
        page={currentPage + 1}
        searchParams={searchParams}
      >
        {"Next >"}
      </PaginationLink>
    </nav>
  )
}

function PaginationLink({
  active = false,
  children,
  currentTab,
  disabled = false,
  page,
  searchParams,
}: {
  active?: boolean
  children: string
  currentTab: "offers" | "roasters"
  disabled?: boolean
  page: number
  searchParams?: SearchPageContentProps["searchParams"]
}) {
  if (disabled) {
    return <span className="page-link is-disabled">{children}</span>
  }

  const href = buildPageHref(currentTab, page, searchParams)

  return (
    <Link
      href={href}
      className={active ? "page-link is-active" : "page-link"}
    >
      {children}
    </Link>
  )
}

function buildPageHref(
  currentTab: "offers" | "roasters",
  page: number,
  searchParams?: SearchPageContentProps["searchParams"],
) {
  const params = new URLSearchParams()

  if (searchParams?.name) {
    params.set("name", searchParams.name)
  }

  for (const prefectureCode of searchParams?.prefectureCodes ?? []) {
    params.append("prefecture_code", prefectureCode)
  }

  if (searchParams?.countryId) {
    params.set("country_id", searchParams.countryId)
  }

  if (searchParams?.roastLevelId) {
    params.set("roast_level_id", searchParams.roastLevelId)
  }

  if (searchParams?.tasteTagId) {
    params.set("taste_tag_id", searchParams.tasteTagId)
  }

  params.set("page", String(page))

  return `${currentTab === "offers" ? "/search/offers" : "/search/roasters"}?${params.toString()}`
}

function collectVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages, currentPage + 1)
  const pages: number[] = []

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  return pages
}
