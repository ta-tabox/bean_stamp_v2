import Link from "next/link"

import {
  ProfileLinksRow,
  ProfileListItemLink,
  ProfileListSection,
  ProfileSummaryCard,
} from "@/components/profiles/ProfileUi"
import { requireSession } from "@/server/auth/guards"
import { getRoasterProfile, listRoasterFollowers } from "@/server/profiles/service"

type RoasterFollowerPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function RoasterFollowerPage({ params }: RoasterFollowerPageProps) {
  const { id } = await params
  const session = await requireSession()
  const [roaster, followers] = await Promise.all([
    getRoasterProfile(id, session.id),
    listRoasterFollowers(id),
  ])

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">フォロワー</h1>
        </div>
      </section>

      <ProfileSummaryCard
        kind="Roasters"
        name={roaster.name}
        handle={`@ roaster-${id}`}
        imageUrl={roaster.thumbnail_url}
        placeholder="roaster"
        description={roaster.describe ?? "ロースター紹介はまだありません。"}
        details={[
          { label: "電話番号", value: roaster.phone_number },
          { label: "都道府県コード", value: roaster.prefecture_code },
          { label: "住所", value: roaster.address },
          { label: "フォロワー数", value: String(followers.length) },
        ]}
        actions={
          session.roasterId === id ? (
            <Link
              href="/roasters/edit"
              className="btn btn-secondary"
            >
              ロースターを編集
            </Link>
          ) : null
        }
      >
        <ProfileLinksRow
          title="導線"
          links={[
            { href: `/roasters/${id}`, label: "ロースター詳細へ戻る", tone: "secondary" },
            { href: "/search/roasters", label: "ロースター検索へ", tone: "secondary" },
          ]}
        />
      </ProfileSummaryCard>

      <ProfileListSection
        title="フォロワー一覧"
        hasItems={followers.length > 0}
        emptyTitle="まだフォロワーはいません"
        emptyDescription="ユーザーがこのロースターをフォローすると、ここに順次表示されます。"
      >
        {followers.map((user) => (
          <ProfileListItemLink
            key={user.id}
            href={`/users/${user.id}`}
            title={user.name}
            subtitle={user.email}
            description={user.describe ?? "自己紹介はまだ設定されていません。"}
            imageUrl={user.thumbnail_url}
            placeholder="user"
            badge={user.prefecture_code}
          />
        ))}
      </ProfileListSection>
    </main>
  )
}
