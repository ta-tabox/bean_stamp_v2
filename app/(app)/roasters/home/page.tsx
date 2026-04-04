import Link from "next/link"

import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildRoastersRoutes } from "@/features/roasters"
import { requireSession } from "@/server/auth/guards"
import { getRoasterProfile } from "@/server/profiles/service"

type RoastersHomePageProps = {
  searchParams?: Promise<{
    deleted?: string
  }>
}

export default async function RoastersHomePage({ searchParams }: RoastersHomePageProps) {
  const session = await requireSession()
  const routes = buildRoastersRoutes(session.roasterId)
  const params = (await searchParams) ?? {}
  const roaster = session.roasterId ? await getRoasterProfile(session.roasterId, session.id) : null

  return (
    <SectionLayout
      badge="Roasters"
      title="ロースターホーム"
      description="ロースター作成後は詳細、編集、フォロワー確認へ進めます。"
      links={routes}
    >
      <main className="space-y-6">
        {params.deleted === "1" ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            ロースターを削除しました。
          </p>
        ) : null}
        {roaster ? (
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
            <h2 className="text-2xl font-semibold">{roaster.name}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
              {roaster.describe ?? "ロースター紹介はまだありません。"}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/roasters/${roaster.id}`}
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                ロースター詳細
              </Link>
              <Link
                href={`/roasters/${roaster.id}/follower`}
                className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
              >
                フォロワー一覧
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
            <h2 className="text-2xl font-semibold">まだロースターに所属していません</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
              新規作成後に詳細・編集・フォロワー一覧を利用できます。
            </p>
            <Link
              href="/roasters/new"
              className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              ロースターを作成する
            </Link>
          </section>
        )}
      </main>
    </SectionLayout>
  )
}
