import Link from "next/link"

import { HomeOfferCard } from "@/components/home/HomeUi"
import { StatusBanner } from "@/components/profiles/ProfileUi"
import { requireSession } from "@/server/auth/guards"
import { listCurrentOffersForRoasterHome } from "@/server/home/service"
import { getRoasterProfile } from "@/server/profiles/service"

type RoastersHomePageProps = {
  searchParams?: Promise<{
    deleted?: string
  }>
}

export default async function RoastersHomePage({ searchParams }: RoastersHomePageProps) {
  const session = await requireSession()
  const params = (await searchParams) ?? {}
  const roaster = session.roasterId ? await getRoasterProfile(session.roasterId, session.id) : null
  const offers = session.roasterId ? await listCurrentOffersForRoasterHome(session.roasterId) : []

  return (
    <main className="space-y-6">
      {params.deleted === "1" ? <StatusBanner>ロースターを削除しました。</StatusBanner> : null}
      {roaster ? (
        <>
          <section className="content-header-panel">
            <div className="flex h-full items-end justify-between">
              <h1 className="title-font text-3xl text-[var(--color-fg)]">{`${roaster.name}のホーム`}</h1>
            </div>
          </section>

          {offers.length ? (
            <section className="space-y-10">
              <ol>
                {offers.map((offer) => (
                  <li
                    key={offer.id}
                    className="my-20 first:mt-4"
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
          ) : (
            <section className="page-card text-center text-gray-400">
              <Link
                href="/beans"
                className="legacy-text-link"
              >
                オファーを作成する
              </Link>
            </section>
          )}
        </>
      ) : (
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
      )}
    </main>
  )
}
