import Link from "next/link"

import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildUsersRoutes } from "@/features/users"
import { getSessionPrincipal } from "@/server/auth/guards"
import { listRoastersFollowedByUser } from "@/server/profiles/service"

type UserFollowingPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function UserFollowingPage({ params }: UserFollowingPageProps) {
  const { id } = await params
  const currentUser = await getSessionPrincipal()
  const routes = buildUsersRoutes(currentUser?.id ?? id)
  const roasters = await listRoastersFollowedByUser(id)

  return (
    <SectionLayout
      badge="Users"
      title={`フォロー一覧 #${id}`}
      description="ユーザーがフォローしているロースター一覧です。"
      links={routes}
    >
      <main className="space-y-4">
        {roasters.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-ink-soft)]">
            フォロー中のロースターはまだありません。
          </section>
        ) : (
          roasters.map((roaster) => (
            <Link
              key={roaster.id}
              href={`/roasters/${roaster.id}`}
              className="block rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{roaster.name}</h2>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    {roaster.address || "住所未設定"}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {roaster.prefecture_code}
                </span>
              </div>
            </Link>
          ))
        )}
      </main>
    </SectionLayout>
  )
}
