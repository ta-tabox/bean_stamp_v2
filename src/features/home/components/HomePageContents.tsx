import Link from "next/link"

import { HomeOfferCard, HomeReloadButton } from "@/components/home/HomeUi"
import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/profiles/ProfileUi"
import type { HomeOfferSummary } from "@/features/home/types"

type UsersHomePageContentProps = {
  offers: readonly HomeOfferSummary[]
  userName: string
}

type RoastersHomePageContentProps = {
  deleted?: boolean
  offers: readonly HomeOfferSummary[]
  roasterName: string
}

export function UsersHomePageContent({ offers, userName }: UsersHomePageContentProps) {
  return (
    <main className="space-y-6">
      <HomePageHeader title={`${userName}のホーム`} />
      <HomeReloadButton />
      <HomeOffersSection
        emptyActionHref="/search/roasters"
        emptyActionLabel="ロースターをフォローしてオファーを受け取る"
        emptyMessage="オファーがありません"
        offers={offers}
      />
    </main>
  )
}

export function RoastersHomePageContent({
  deleted = false,
  offers,
  roasterName,
}: RoastersHomePageContentProps) {
  return (
    <main className="space-y-6">
      {deleted ? <StatusBanner>ロースターを削除しました。</StatusBanner> : null}
      <HomePageHeader title={`${roasterName}のホーム`} />
      <HomeOffersSection
        emptyActionHref="/beans"
        emptyActionLabel="オファーを作成する"
        offers={offers}
      />
    </main>
  )
}

export function RoasterHomeMissingContent() {
  return (
    <main className="space-y-6">
      <section className="page-card">
        <h1 className="title-font text-3xl text-[var(--color-fg)]">
          まだロースターに所属していません
        </h1>
        <Link
          href="/roasters/new"
          className="btn btn-primary mt-6"
        >
          ロースターを作成する
        </Link>
      </section>
    </main>
  )
}

function HomePageHeader({ title }: { title: string }) {
  return <ContentHeader title={title} />
}

function HomeOffersSection({
  emptyActionHref,
  emptyActionLabel,
  emptyMessage,
  offers,
}: {
  emptyActionHref: string
  emptyActionLabel: string
  emptyMessage?: string
  offers: readonly HomeOfferSummary[]
}) {
  if (!offers.length) {
    return (
      <section className="page-card text-center text-gray-400">
        {emptyMessage ? <p>{emptyMessage}</p> : null}
        <Link
          href={emptyActionHref}
          className={emptyMessage ? "legacy-text-link mt-2" : "legacy-text-link"}
        >
          {emptyActionLabel}
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-10">
      <ol>
        {offers.map((offer, index) => (
          <li
            key={offer.id}
            className={index === 0 ? "mt-4" : "mt-20"}
          >
            <HomeOfferCard
              beanImageUrl={offer.beanImageUrl}
              beanName={offer.beanName}
              countryName={offer.countryName}
              href={`/offers/${offer.id}`}
              price={offer.price}
              process={offer.process}
              roastLevelName={offer.roastLevelName}
              roasterHref={`/roasters/${offer.roasterId}`}
              roasterImageUrl={offer.roasterImageUrl}
              roasterName={offer.roasterName}
              status={offer.status}
              wantsCount={offer.wantsCount}
              weight={offer.weight}
            />
          </li>
        ))}
      </ol>
    </section>
  )
}
