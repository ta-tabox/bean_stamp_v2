/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { ProfileListSection, StatusBanner } from "@/components/profiles/ProfileUi"
import { requireSession } from "@/server/auth/guards"
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

  return (
    <main className="space-y-6">
      {params.deleted === "1" ? <StatusBanner>ロースターを削除しました。</StatusBanner> : null}
      {roaster ? (
        <>
          <section className="page-card">
            <div className="border-b border-[var(--color-border)] pb-5">
              <p className="panel-label">Roasters</p>
              <h1 className="title-font mt-3 text-3xl text-[var(--color-fg)]">ロースターホーム</h1>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
              <div>
                <h2 className="title-font text-2xl text-[var(--color-fg)]">{roaster.name}</h2>
                <div className="mt-4 flex items-center gap-4">
                  <div className="profile-avatar h-24 w-24">
                    <img
                      src={roaster.thumbnail_url ?? "/images/default-roaster.svg"}
                      alt={`${roaster.name}の画像`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="title-font text-lg text-[var(--color-fg)]">{roaster.name}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{roaster.address}</p>
                  </div>
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="detail-tile">
                    <dt className="panel-label">電話番号</dt>
                    <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                      {roaster.phone_number}
                    </dd>
                  </div>
                  <div className="detail-tile">
                    <dt className="panel-label">都道府県コード</dt>
                    <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                      {roaster.prefecture_code}
                    </dd>
                  </div>
                  <div className="detail-tile">
                    <dt className="panel-label">住所</dt>
                    <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                      {roaster.address}
                    </dd>
                  </div>
                  <div className="detail-tile">
                    <dt className="panel-label">フォロワー数</dt>
                    <dd className="mt-2 text-lg font-medium text-[var(--color-fg)]">
                      {roaster.followers_count ?? 0}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 rounded-[1.25rem] border border-[var(--color-border)] bg-white/70 p-5">
                  <p className="panel-label">Describe</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {roaster.describe ?? "ロースター紹介はまだありません。"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
                <p className="panel-label">Quick Actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    href={`/roasters/${roaster.id}`}
                    className="btn btn-primary"
                  >
                    ロースター詳細
                  </Link>
                  <Link
                    href={`/roasters/${roaster.id}/follower`}
                    className="btn btn-secondary"
                  >
                    フォロワー一覧
                  </Link>
                  <Link
                    href="/roasters/edit"
                    className="btn btn-secondary"
                  >
                    ロースターを編集
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
              href={`/roasters/${roaster.id}`}
              className="list-item-link"
            >
              <div className="min-w-0 flex-1">
                <p className="title-font text-lg text-[var(--color-fg)]">ロースター詳細を見る</p>
              </div>
              <span className="metric-chip">DETAIL</span>
            </Link>
            <Link
              href={`/roasters/${roaster.id}/follower`}
              className="list-item-link"
            >
              <div className="min-w-0 flex-1">
                <p className="title-font text-lg text-[var(--color-fg)]">
                  フォロワー一覧を確認する
                </p>
              </div>
              <span className="metric-chip">FOLLOWER</span>
            </Link>
            <Link
              href="/roasters/edit"
              className="list-item-link"
            >
              <div className="min-w-0 flex-1">
                <p className="title-font text-lg text-[var(--color-fg)]">
                  ロースター情報を編集する
                </p>
              </div>
              <span className="metric-chip">EDIT</span>
            </Link>
          </ProfileListSection>
        </>
      ) : (
        <section className="page-card">
          <p className="panel-label">Roasters</p>
          <h1 className="title-font mt-3 text-3xl text-[var(--color-fg)]">
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
