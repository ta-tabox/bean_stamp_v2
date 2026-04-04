import Link from "next/link"

import { ProfileLinksRow, ProfileSummaryCard, StatusBanner } from "@/components/profiles/ProfileUi"
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
  const search = (await searchParams) ?? {}

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ユーザー詳細</h1>
        </div>
      </section>
      {search.updated === "1" ? <StatusBanner>プロフィールを更新しました。</StatusBanner> : null}
      <ProfileSummaryCard
        kind="User"
        name={user.name}
        handle={`@ ${user.prefecture_code}`}
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
          { label: "ゲスト", value: user.guest ? "はい" : "いいえ" },
        ]}
        actions={
          currentUser?.id === id ? (
            <Link
              href="/users/edit"
              className="btn btn-secondary"
            >
              編集
            </Link>
          ) : null
        }
      >
        <ProfileLinksRow
          title="関連導線"
          links={[
            { href: `/users/${id}/following`, label: "フォロー一覧" },
            ...(user.roaster_id !== null
              ? [
                  {
                    href: `/roasters/${user.roaster_id}`,
                    label: "所属ロースター",
                    tone: "secondary" as const,
                  },
                ]
              : []),
          ]}
        />
      </ProfileSummaryCard>
    </main>
  )
}
