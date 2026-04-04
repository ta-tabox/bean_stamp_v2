/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { ProfileListSection } from "@/components/profiles/ProfileUi"
import { requireSession } from "@/server/auth/guards"
import { getUserProfile } from "@/server/profiles/service"

export default async function UsersHomePage() {
  const session = await requireSession()
  const user = await getUserProfile(session.id)

  return (
    <main className="space-y-6">
      <section className="page-card">
        <div className="border-b border-[var(--color-border)] pb-5">
          <p className="panel-label">Users</p>
          <h1 className="title-font mt-3 text-3xl text-[var(--color-fg)]">ユーザーホーム</h1>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
          <div>
            <h2 className="title-font text-2xl text-[var(--color-fg)]">
              {user.name || "ユーザー"}
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="profile-avatar h-24 w-24">
                <img
                  src={user.thumbnail_url ?? "/images/default-user.svg"}
                  alt={`${user.name}の画像`}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="title-font text-lg text-[var(--color-fg)]">{user.name}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{user.email}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="detail-tile">
                <dt className="panel-label">名前</dt>
                <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                  {user.name || "未設定"}
                </dd>
              </div>
              <div className="detail-tile">
                <dt className="panel-label">メールアドレス</dt>
                <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">{user.email}</dd>
              </div>
              <div className="detail-tile">
                <dt className="panel-label">都道府県コード</dt>
                <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                  {session.prefectureCode}
                </dd>
              </div>
              <div className="detail-tile">
                <dt className="panel-label">ロースター所属</dt>
                <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                  {session.roasterId ? `所属中 #${session.roasterId}` : "未所属"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
            <p className="panel-label">Quick Actions</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`/users/${user.id}`}
                className="btn btn-primary"
              >
                プロフィールを見る
              </Link>
              <Link
                href={`/users/${user.id}/following`}
                className="btn btn-secondary"
              >
                フォロー中ロースター
              </Link>
              <Link
                href={session.roasterId ? `/roasters/${session.roasterId}` : "/roasters/new"}
                className="btn btn-secondary"
              >
                {session.roasterId ? "所属ロースターへ" : "ロースターを作成する"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProfileListSection
        title="ホーム導線"
        hasItems
        emptyTitle=""
        emptyDescription=""
      >
        <Link
          href={`/users/${user.id}`}
          className="list-item-link"
        >
          <div className="min-w-0 flex-1">
            <p className="title-font text-lg text-[var(--color-fg)]">プロフィールを見る</p>
          </div>
          <span className="metric-chip">PROFILE</span>
        </Link>
        <Link
          href={`/users/${user.id}/following`}
          className="list-item-link"
        >
          <div className="min-w-0 flex-1">
            <p className="title-font text-lg text-[var(--color-fg)]">フォロー状況を確認する</p>
          </div>
          <span className="metric-chip">FOLLOW</span>
        </Link>
        <Link
          href={session.roasterId ? `/roasters/${session.roasterId}` : "/roasters/new"}
          className="list-item-link"
        >
          <div className="min-w-0 flex-1">
            <p className="title-font text-lg text-[var(--color-fg)]">
              {session.roasterId ? "所属ロースターへ進む" : "ロースターを作成する"}
            </p>
          </div>
          <span className="metric-chip">{session.roasterId ? "ROASTER" : "CREATE"}</span>
        </Link>
      </ProfileListSection>
    </main>
  )
}
