import { SectionLayout } from "@/components/layout/SectionLayout"
import { ProfileField, ProfileFormShell, ProfileTextarea } from "@/components/profiles/ProfileUi"
import { buildUsersRoutes } from "@/features/users"
import { requireSession } from "@/server/auth/guards"
import { updateUserProfileAction } from "@/server/profiles/actions"
import { getUserProfile } from "@/server/profiles/service"

export default async function UserEditPage() {
  const session = await requireSession()
  const user = await getUserProfile(session.id)
  const routes = buildUsersRoutes(session.id)

  return (
    <SectionLayout
      badge="Users"
      title="プロフィール編集"
      description="ユーザー情報の編集"
      links={routes}
    >
      <main>
        <form
          action={updateUserProfileAction}
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
      </main>
    </SectionLayout>
  )
}
