import Link from "next/link"

import { HomeOfferCard, HomeReloadButton } from "@/components/home/HomeUi"
import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/profiles/ProfileUi"
import type { HomeOfferSummary } from "@/features/home/types"

type UsersHomePageContentProps = {
  currentRoasterId?: string | null
  offers: readonly HomeOfferSummary[]
  userName: string
}

type RoastersHomePageContentProps = {
  currentRoasterId?: string | null
  deleted?: boolean
  offers: readonly HomeOfferSummary[]
  roasterName: string
}

export function UsersHomePageContent({
  currentRoasterId,
  offers,
  userName,
}: UsersHomePageContentProps) {
  return (
    <main className="space-y-6">
      <HomePageHeader title={`${userName}のホーム`} />
      <HomeReloadButton />
      <HomeOffersSection
        currentRoasterId={currentRoasterId}
        emptyActionHref="/search/roasters"
        emptyActionLabel="ロースターをフォローしてオファーを受け取る"
        emptyMessage="オファーがありません"
        offers={offers}
      />
    </main>
  )
}

export function RoastersHomePageContent({
  currentRoasterId,
  deleted = false,
  offers,
  roasterName,
}: RoastersHomePageContentProps) {
  return (
    <main className="space-y-6">
      {deleted ? <StatusBanner>ロースターを削除しました。</StatusBanner> : null}
      <HomePageHeader title={`${roasterName}のホーム`} />
      <HomeOffersSection
        currentRoasterId={currentRoasterId}
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
  currentRoasterId,
  emptyActionHref,
  emptyActionLabel,
  emptyMessage,
  offers,
}: {
  currentRoasterId?: string | null
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
