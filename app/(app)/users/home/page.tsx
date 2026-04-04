import Link from "next/link"

import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildUsersRoutes } from "@/features/users"
import { requireSession } from "@/server/auth/guards"

export default async function UsersHomePage() {
  const session = await requireSession()
  const routes = buildUsersRoutes(session.id)

  return (
    <SectionLayout
      badge="Users"
      title="ユーザーホーム"
      description="プロフィール、フォロー中ロースター、ロースター作成導線をここから辿れます。"
      links={routes}
    >
      <main className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
          <h2 className="text-2xl font-semibold">ログイン情報</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                名前
              </dt>
              <dd className="mt-2 text-lg font-medium">{session.name || "未設定"}</dd>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                メールアドレス
              </dt>
              <dd className="mt-2 text-lg font-medium">{session.email}</dd>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                都道府県コード
              </dt>
              <dd className="mt-2 text-lg font-medium">{session.prefectureCode}</dd>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                ロースター所属
              </dt>
              <dd className="mt-2 text-lg font-medium">
                {session.roasterId ? `所属中 #${session.roasterId}` : "未所属"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href={`/users/${session.id}`}
            className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]"
          >
            <h2 className="text-xl font-semibold">プロフィールを見る</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
              ユーザー詳細 API と同じ内容を SSR で表示します。
            </p>
          </Link>
          <Link
            href={session.roasterId ? `/roasters/${session.roasterId}` : "/roasters/new"}
            className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]"
          >
            <h2 className="text-xl font-semibold">
              {session.roasterId ? "所属ロースターへ" : "ロースターを作成する"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
              {session.roasterId
                ? "ロースター詳細、編集、フォロワー一覧を確認できます。"
                : "未所属ユーザーはここからロースターを作成できます。"}
            </p>
          </Link>
        </section>
      </main>
    </SectionLayout>
  )
}
