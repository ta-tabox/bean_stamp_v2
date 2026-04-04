import Link from "next/link"

import { ProfileLinksRow, ProfileSummaryCard, StatusBanner } from "@/components/profiles/ProfileUi"
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
  const ownRoaster = session.roasterId === id
  const currentParams = (await searchParams) ?? {}

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ロースター</h1>
        </div>
      </section>
      {currentParams.created === "1" ? (
        <StatusBanner>ロースターを作成しました。</StatusBanner>
      ) : null}
      {currentParams.updated === "1" ? (
        <StatusBanner>ロースターを更新しました。</StatusBanner>
      ) : null}
      {currentParams.followed === "1" ? (
        <StatusBanner>ロースターをフォローしました。</StatusBanner>
      ) : null}
      {currentParams.unfollowed === "1" ? (
        <StatusBanner>ロースターのフォローを解除しました。</StatusBanner>
      ) : null}
      <ProfileSummaryCard
        kind="Roaster"
        name={roaster.name}
        handle={roaster.address}
        imageUrl={roaster.thumbnail_url}
        placeholder="roaster"
        description={roaster.describe ?? "ロースター紹介はまだありません。"}
        details={[
          { label: "電話番号", value: roaster.phone_number },
          { label: "都道府県コード", value: roaster.prefecture_code },
          { label: "住所", value: roaster.address },
          { label: "フォロワー数", value: String(roaster.followers_count ?? 0) },
        ]}
        actions={
          ownRoaster ? (
            <Link
              href="/roasters/edit"
              className="btn btn-secondary"
            >
              編集
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
                className="btn btn-primary"
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
                className="btn btn-secondary"
              >
                フォロー解除
              </button>
            </form>
          )
        }
      >
        <ProfileLinksRow
          title="関連導線"
          links={[
            {
              href: `/roasters/${roaster.id}/follower`,
              label: "フォロワー一覧",
              tone: "secondary",
            },
            { href: "/search/roasters", label: "ロースター検索へ", tone: "secondary" },
          ]}
        />
      </ProfileSummaryCard>
    </main>
  )
}
