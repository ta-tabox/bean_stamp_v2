import type { ReactNode } from "react"
import Link from "next/link"

import { ContentHeader } from "@/components/layout/ContentHeader"
import { HomeOfferCard } from "@/components/home/HomeUi"
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
import { resolvePrefectureLabel } from "@/components/shared/prefecture-label"
import type { HomeOfferSummary } from "@/features/home/types"
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
  currentRoasterId?: string | null
  roaster: RoasterProfileView
  offers: readonly HomeOfferSummary[]
  status?: {
    created?: boolean
    followed?: boolean
    unfollowed?: boolean
    updated?: boolean
  }
  followAction?: ReactNode
}

type UserFollowingPageContentProps = {
  roasters: readonly RoasterProfileView[]
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
        handle={`@ ${resolvePrefectureLabel(user.prefecture_code)}`}
        imageUrl={user.thumbnail_url}
        placeholder="user"
        description={user.describe ?? "自己紹介はまだ設定されていません。"}
        details={[
          { label: "メールアドレス", value: user.email },
          { label: "都道府県", value: resolvePrefectureLabel(user.prefecture_code) },
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
  currentRoasterId,
  followAction,
  offers,
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
          { label: "都道府県", value: resolvePrefectureLabel(roaster.prefecture_code) },
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

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="title-font text-2xl text-[var(--color-fg)]">このロースターのオファー</h2>
          <p className="text-sm text-[var(--color-muted)]">{`${offers.length}件`}</p>
        </div>

        {offers.length ? (
          <ol className="space-y-10">
            {offers.map((offer) => (
              <li key={offer.id}>
                <HomeOfferCard
                  acidity={offer.acidity}
                  amount={offer.amount}
                  beanImageUrl={offer.beanImageUrl}
                  beanName={offer.beanName}
                  bitterness={offer.bitterness}
                  body={offer.body}
                  countryName={offer.countryName}
                  createdAt={offer.createdAt}
                  endedAt={offer.endedAt}
                  flavor={offer.flavor}
                  href={`/offers/${offer.id}`}
                  id={offer.id}
                  initialLikeId={offer.initialLikeId}
                  initialWantId={offer.initialWantId}
                  price={offer.price}
                  process={offer.process}
                  receiptEndedAt={offer.receiptEndedAt}
                  receiptStartedAt={offer.receiptStartedAt}
                  roastLevelName={offer.roastLevelName}
                  roastedAt={offer.roastedAt}
                  roasterHref={`/roasters/${offer.roasterId}`}
                  roasterImageUrl={offer.roasterImageUrl}
                  roasterName={offer.roasterName}
                  showEngagement={currentRoasterId !== offer.roasterId}
                  status={offer.status}
                  sweetness={offer.sweetness}
                  tasteNames={offer.tasteNames}
                  wantsCount={offer.wantsCount}
                  weight={offer.weight}
                />
              </li>
            ))}
          </ol>
        ) : (
          <section className="page-card">
            <div className="empty-state">
              <h3 className="title-font text-2xl text-[var(--color-fg)]">
                まだオファーがありません
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                このロースターがオファーを公開すると、ここに一覧表示されます。
              </p>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export function UserFollowingPageContent({ roasters }: UserFollowingPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="フォロー" />

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
            badge={resolvePrefectureLabel(roaster.prefecture_code)}
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
          { label: "都道府県", value: resolvePrefectureLabel(roaster.prefecture_code) },
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
            badge={resolvePrefectureLabel(user.prefecture_code)}
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
