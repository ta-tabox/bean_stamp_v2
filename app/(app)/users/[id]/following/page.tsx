import Link from "next/link"

import {
  ProfileLinksRow,
  ProfileListItemLink,
  ProfileListSection,
  ProfileSummaryCard,
} from "@/components/profiles/ProfileUi"
import { getSessionPrincipal } from "@/server/auth/guards"
import { getUserProfile, listRoastersFollowedByUser } from "@/server/profiles/service"

type UserFollowingPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function UserFollowingPage({ params }: UserFollowingPageProps) {
  const { id } = await params
  const currentUser = await getSessionPrincipal()
  const [user, roasters] = await Promise.all([getUserProfile(id), listRoastersFollowedByUser(id)])

  return (
    <main className="space-y-6">
      <section className="page-card">
        <p className="panel-label">Users</p>
        <h1 className="title-font mt-3 text-3xl text-[var(--color-fg)]">{`フォロー一覧 #${id}`}</h1>
      </section>

      <ProfileSummaryCard
        kind="Users"
        name={user.name}
        handle={`@ user-${id}`}
        imageUrl={user.thumbnail_url}
        placeholder="user"
        description={user.describe ?? "自己紹介はまだ設定されていません。"}
        details={[
          { label: "メールアドレス", value: user.email },
          { label: "都道府県コード", value: user.prefecture_code },
          {
            label: "所属ロースター",
            value: user.roaster_id === null ? "未所属" : `#${user.roaster_id}`,
          },
          { label: "フォロー件数", value: String(roasters.length) },
        ]}
        actions={
          currentUser?.id === id ? (
            <Link
              href="/users/edit"
              className="btn btn-secondary"
            >
              プロフィールを編集
            </Link>
          ) : null
        }
      >
        <ProfileLinksRow
          title="導線"
          links={[
            { href: `/users/${id}`, label: "プロフィールへ戻る", tone: "secondary" },
            { href: "/search/roasters", label: "ロースターを探す", tone: "primary" },
          ]}
        />
      </ProfileSummaryCard>

      <ProfileListSection
        title="フォロー中ロースター"
        hasItems={roasters.length > 0}
        emptyTitle="フォロー中のロースターはまだありません"
        emptyDescription="検索ページからロースターを見つけてフォローすると、この一覧に反映されます。"
        emptyAction={{ href: "/search/roasters", label: "ロースターを探す", tone: "primary" }}
      >
        {roasters.map((roaster) => (
          <ProfileListItemLink
            key={roaster.id}
            href={`/roasters/${roaster.id}`}
            title={roaster.name}
            subtitle={roaster.address || "住所未設定"}
            description={roaster.describe ?? "紹介文はまだ登録されていません。"}
            imageUrl={roaster.thumbnail_url}
            placeholder="roaster"
            badge={roaster.prefecture_code}
          />
        ))}
      </ProfileListSection>
    </main>
  )
}
