import Link from "next/link"

import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildUsersRoutes } from "@/features/users"
import { getSessionPrincipal } from "@/server/auth/guards"
import { getUserProfile } from "@/server/profiles/service"

type UserPageProps = Readonly<{
  params: Promise<{ id: string }>
  searchParams?: Promise<{ updated?: string }>
}>

export default async function UserPage({ params, searchParams }: UserPageProps) {
  const { id } = await params
  const currentUser = await getSessionPrincipal()
  const user = await getUserProfile(id)
  const routes = buildUsersRoutes(currentUser?.id ?? id)
  const search = (await searchParams) ?? {}

  return (
    <SectionLayout
      badge="Users"
      title={`ユーザー詳細 #${id}`}
      description="旧 Users API のレスポンス形状に沿ったプロフィール表示です。"
      links={routes}
    >
      <main className="space-y-6">
        {search.updated === "1" ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            プロフィールを更新しました。
          </p>
        ) : null}
        <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Profile
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{user.name}</h2>
            </div>
            {currentUser?.id === id ? (
              <Link
                href="/users/edit"
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                プロフィールを編集
              </Link>
            ) : null}
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="メールアドレス"
              value={user.email}
            />
            <DetailItem
              label="都道府県コード"
              value={user.prefecture_code}
            />
            <DetailItem
              label="所属ロースター"
              value={user.roaster_id === null ? "未所属" : `#${user.roaster_id}`}
            />
            <DetailItem
              label="ゲスト"
              value={user.guest ? "はい" : "いいえ"}
            />
          </dl>
          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
              自己紹介
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
              {user.describe ?? "未設定"}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
          <h2 className="text-xl font-semibold">関連導線</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/users/${id}/following`}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
            >
              フォロー中ロースターを見る
            </Link>
            {user.roaster_id !== null ? (
              <Link
                href={`/roasters/${user.roaster_id}`}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
              >
                所属ロースターを見る
              </Link>
            ) : null}
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
