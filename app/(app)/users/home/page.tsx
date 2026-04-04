import Link from "next/link"

import { HomeOfferCard, HomeReloadButton } from "@/components/home/HomeUi"
import { requireSession } from "@/server/auth/guards"
import { listCurrentOffersForUserHome } from "@/server/home/service"
import { getUserProfile } from "@/server/profiles/service"

export default async function UsersHomePage() {
  const session = await requireSession()
  const user = await getUserProfile(session.id)
  const offers = await listCurrentOffersForUserHome(session.id)

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-between">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">{`${user.name}のホーム`}</h1>
        </div>
      </section>

      <HomeReloadButton />

      {offers.length ? (
        <section className="space-y-10">
          <ol>
            {offers.map((offer) => (
              <li
                key={offer.id}
                className="mt-20 first:mt-4"
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
          <p>オファーがありません</p>
          <Link
            href="/search/roasters"
            className="legacy-text-link mt-2"
          >
            ロースターをフォローしてオファーを受け取る
          </Link>
        </section>
      )}
    </main>
  )
}
