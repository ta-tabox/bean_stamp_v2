import Link from "next/link"

import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildRoastersRoutes } from "@/features/roasters"
import { requireSession } from "@/server/auth/guards"
import { listRoasterFollowers } from "@/server/profiles/service"

type RoasterFollowerPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function RoasterFollowerPage({ params }: RoasterFollowerPageProps) {
  const { id } = await params
  const session = await requireSession()
  const routes = buildRoastersRoutes(session.roasterId ?? id)
  const followers = await listRoasterFollowers(id)

  return (
    <SectionLayout
      badge="Roasters"
      title={`フォロワー一覧 #${id}`}
      description="このロースターをフォローしているユーザー一覧です。"
      links={routes}
    >
      <main className="space-y-4">
        {followers.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-ink-soft)]">
            まだフォロワーはいません。
          </section>
        ) : (
          followers.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="block rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{user.email}</p>
                </div>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {user.prefecture_code}
                </span>
              </div>
            </Link>
          ))
        )}
      </main>
    </SectionLayout>
  )
}
