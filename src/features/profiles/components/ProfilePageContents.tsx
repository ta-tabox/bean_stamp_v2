import type { ReactNode } from "react"
import Link from "next/link"

import { ContentHeader } from "@/components/layout/ContentHeader"
import {
  ProfileField,
  ProfileFormShell,
  ProfileLinksRow,
  ProfileListItemLink,
  ProfileListSection,
  ProfileSummaryCard,
  ProfileTextarea,
  StatusBanner,
} from "@/components/profiles/ProfileUi"
import type { RoasterProfileView, UserProfileView } from "@/features/profiles/types"

type FormAction = (formData: FormData) => Promise<void>

type UserProfilePageContentProps = {
  canEdit: boolean
  status?: {
    updated?: boolean
  }
  user: UserProfileView
}

type RoasterProfilePageContentProps = {
  canEdit: boolean
  roaster: RoasterProfileView
  status?: {
    created?: boolean
    followed?: boolean
    unfollowed?: boolean
    updated?: boolean
  }
  followAction?: ReactNode
}

type UserFollowingPageContentProps = {
  canEdit: boolean
  roasters: readonly RoasterProfileView[]
  user: UserProfileView
}

type RoasterFollowerPageContentProps = {
  canEdit: boolean
  followers: readonly UserProfileView[]
  roaster: RoasterProfileView
}

type UserEditPageContentProps = {
  action: FormAction
  user: UserProfileView
}

type RoasterEditPageContentProps = {
  action: FormAction
  roaster: RoasterProfileView
}

type RoasterNewPageContentProps = {
  action: FormAction
}

type DangerZonePageContentProps = {
  action: () => Promise<void>
  description: string
  heading: string
  submitLabel: string
  title: string
}

export function UserProfilePageContent({ canEdit, status, user }: UserProfilePageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="ユーザー詳細" />
      {status?.updated ? <StatusBanner>プロフィールを更新しました。</StatusBanner> : null}
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
          canEdit ? (
            <Link
              href="/users/edit"
              className="btn btn-secondary btn-compact"
            >
              編集
            </Link>
          ) : null
        }
      >
        <ProfileLinksRow
          title="関連導線"
          links={[
            { href: `/users/${user.id}/following`, label: "フォロー一覧" },
            ...(user.roaster_id === null
              ? []
              : [
                  {
                    href: `/roasters/${user.roaster_id}`,
                    label: "所属ロースター",
                    tone: "secondary" as const,
                  },
                ]),
          ]}
        />
      </ProfileSummaryCard>
    </main>
  )
}

export function RoasterProfilePageContent({
  canEdit,
  followAction,
  roaster,
  status,
}: RoasterProfilePageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="ロースター" />
      <StatusMessages
        messages={[
          status?.created ? "ロースターを作成しました。" : null,
          status?.updated ? "ロースターを更新しました。" : null,
          status?.followed ? "ロースターをフォローしました。" : null,
          status?.unfollowed ? "ロースターのフォローを解除しました。" : null,
        ]}
      />
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
          canEdit ? (
            <Link
              href="/roasters/edit"
              className="btn btn-secondary btn-compact"
            >
              編集
            </Link>
          ) : (
            followAction
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

export function UserFollowingPageContent({
  canEdit,
  roasters,
  user,
}: UserFollowingPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="フォロー" />
      <ProfileSummaryCard
        kind="Users"
        name={user.name}
        handle={`@ user-${user.id}`}
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
          canEdit ? (
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
            { href: `/users/${user.id}`, label: "ユーザー詳細へ戻る", tone: "secondary" },
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

export function RoasterFollowerPageContent({
  canEdit,
  followers,
  roaster,
}: RoasterFollowerPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="フォロワー" />
      <ProfileSummaryCard
        kind="Roasters"
        name={roaster.name}
        handle={`@ roaster-${roaster.id}`}
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
          canEdit ? (
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
            {
              href: `/roasters/${roaster.id}`,
              label: "ロースター詳細へ戻る",
              tone: "secondary",
            },
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

export function UserEditPageContent({ action, user }: UserEditPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="ユーザー編集" />
      <section className="page-card">
        <form
          action={action}
          className="space-y-4"
        >
          <ProfileFormShell
            kind="Users"
            title="ユーザー情報編集"
            description="プロフィール画像、基本情報、自己紹介を更新します。"
            name={user.name}
            handle={user.email}
            imageUrl={user.thumbnail_url}
            placeholder="user"
            submitLabel="更新する"
            footerLinks={[
              { href: "/users/password", label: "パスワード変更" },
              { href: "/users/cancel", label: "退会する" },
            ]}
          >
            <ProfileField
              label="名前"
              name="name"
              defaultValue={user.name}
            />
            <ProfileField
              label="メールアドレス"
              name="email"
              type="email"
              defaultValue={user.email}
            />
            <ProfileField
              label="都道府県コード"
              name="prefectureCode"
              defaultValue={user.prefecture_code}
            />
            <ProfileField
              label="プロフィール画像 URL"
              name="imageUrl"
              type="url"
              required={false}
              defaultValue={user.image_url ?? ""}
            />
            <ProfileTextarea
              label="自己紹介"
              name="describe"
              defaultValue={user.describe ?? ""}
            />
          </ProfileFormShell>
        </form>
      </section>
    </main>
  )
}

export function RoasterEditPageContent({ action, roaster }: RoasterEditPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="ロースター編集" />
      <section className="page-card">
        <form
          action={action}
          className="space-y-4"
        >
          <ProfileFormShell
            kind="Roasters"
            title="ロースター情報編集"
            description="ロゴ画像、基本情報、紹介文を更新します。"
            name={roaster.name}
            handle={roaster.address}
            imageUrl={roaster.thumbnail_url}
            placeholder="roaster"
            submitLabel="更新する"
            footerLinks={[{ href: "/roasters/cancel", label: "ロースターを削除する" }]}
          >
            <ProfileField
              label="ロースター名"
              name="name"
              defaultValue={roaster.name}
            />
            <ProfileField
              label="電話番号"
              name="phoneNumber"
              defaultValue={roaster.phone_number}
            />
            <ProfileField
              label="都道府県コード"
              name="prefectureCode"
              defaultValue={roaster.prefecture_code}
            />
            <ProfileField
              label="住所"
              name="address"
              defaultValue={roaster.address}
            />
            <ProfileField
              label="ロゴ画像 URL"
              name="imageUrl"
              type="url"
              required={false}
              defaultValue={roaster.image_url ?? ""}
            />
            <ProfileTextarea
              label="紹介文"
              name="describe"
              defaultValue={roaster.describe ?? ""}
            />
          </ProfileFormShell>
        </form>
      </section>
    </main>
  )
}

export function RoasterNewPageContent({ action }: RoasterNewPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="ロースター新規作成" />
      <section className="page-card">
        <form
          action={action}
          className="space-y-4"
        >
          <ProfileFormShell
            kind="Roasters"
            title="ロースター情報入力"
            description="ロースターの基本情報を入力して公開ページを作成します。"
            name="新しいロースター"
            imageUrl={null}
            placeholder="roaster"
            submitLabel="保存する"
          >
            <ProfileField
              label="ロースター名"
              name="name"
              defaultValue=""
            />
            <ProfileField
              label="電話番号"
              name="phoneNumber"
              defaultValue=""
            />
            <ProfileField
              label="都道府県コード"
              name="prefectureCode"
              defaultValue=""
            />
            <ProfileField
              label="住所"
              name="address"
              defaultValue=""
            />
            <ProfileField
              label="ロゴ画像 URL"
              name="imageUrl"
              type="url"
              required={false}
              defaultValue=""
            />
            <ProfileTextarea
              label="紹介文"
              name="describe"
              defaultValue=""
            />
          </ProfileFormShell>
        </form>
      </section>
    </main>
  )
}

export function DangerZonePageContent({
  action,
  description,
  heading,
  submitLabel,
  title,
}: DangerZonePageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title={title} />
      <section className="page-card border-rose-200 bg-rose-50">
        <h2 className="text-2xl font-semibold text-rose-900">{heading}</h2>
        <p className="mt-3 text-sm leading-7 text-rose-800">{description}</p>
        <form
          action={action}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {submitLabel}
          </button>
        </form>
      </section>
    </main>
  )
}

function StatusMessages({ messages }: { messages: readonly (string | null)[] }) {
  return messages
    .filter((message): message is string => Boolean(message))
    .map((message) => <StatusBanner key={message}>{message}</StatusBanner>)
}
