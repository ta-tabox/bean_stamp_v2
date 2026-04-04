import Link from "next/link"

import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildRoastersRoutes } from "@/features/roasters"
import { requireSession } from "@/server/auth/guards"
import { followRoasterAction, unfollowRoasterAction } from "@/server/profiles/actions"
import { getRoasterProfile } from "@/server/profiles/service"

type RoasterPageProps = Readonly<{
  params: Promise<{ id: string }>
  searchParams?: Promise<{
    created?: string
    followed?: string
    unfollowed?: string
    updated?: string
  }>
}>

export default async function RoasterPage({ params, searchParams }: RoasterPageProps) {
  const { id } = await params
  const session = await requireSession()
  const roaster = await getRoasterProfile(id, session.id)
  const routes = buildRoastersRoutes(session.roasterId ?? id)
  const ownRoaster = session.roasterId === id
  const currentParams = (await searchParams) ?? {}

  return (
    <SectionLayout
      badge="Roasters"
      title={`ロースター詳細 #${id}`}
      description="旧 Roasters API の詳細レスポンスを画面化したページです。"
      links={routes}
    >
      <main className="space-y-6">
        {currentParams.created === "1" ? (
          <StatusMessage message="ロースターを作成しました。" />
        ) : null}
        {currentParams.updated === "1" ? (
          <StatusMessage message="ロースターを更新しました。" />
        ) : null}
        {currentParams.followed === "1" ? (
          <StatusMessage message="ロースターをフォローしました。" />
        ) : null}
        {currentParams.unfollowed === "1" ? (
          <StatusMessage message="ロースターのフォローを解除しました。" />
        ) : null}
        <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Roaster
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{roaster.name}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {roaster.describe ?? "ロースター紹介はまだありません。"}
              </p>
            </div>
            {ownRoaster ? (
              <Link
                href="/roasters/edit"
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                ロースターを編集
              </Link>
            ) : roaster.roaster_relationship_id === null ? (
              <form action={followRoasterAction}>
                <input
                  type="hidden"
                  name="roasterId"
                  value={roaster.id}
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
                >
                  フォローする
                </button>
              </form>
            ) : (
              <form action={unfollowRoasterAction}>
                <input
                  type="hidden"
                  name="relationshipId"
                  value={roaster.roaster_relationship_id}
                />
                <input
                  type="hidden"
                  name="roasterId"
                  value={roaster.id}
                />
                <button
                  type="submit"
                  className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  フォロー解除
                </button>
              </form>
            )}
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="電話番号"
              value={roaster.phone_number}
            />
            <DetailItem
              label="都道府県コード"
              value={roaster.prefecture_code}
            />
            <DetailItem
              label="住所"
              value={roaster.address}
            />
            <DetailItem
              label="フォロワー数"
              value={String(roaster.followers_count ?? 0)}
            />
          </dl>
        </section>

        <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
          <h2 className="text-xl font-semibold">関連導線</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/roasters/${roaster.id}/follower`}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
            >
              フォロワー一覧を見る
            </Link>
            <Link
              href="/search/roasters"
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
            >
              ロースター検索へ
            </Link>
          </div>
        </section>
      </main>
    </SectionLayout>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
      <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">{label}</dt>
      <dd className="mt-2 text-lg font-medium">{value}</dd>
    </div>
  )
}

function StatusMessage({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      {message}
    </p>
  )
}
