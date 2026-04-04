import { ProfileField, ProfileFormShell, ProfileTextarea } from "@/components/profiles/ProfileUi"
import { requireRoasterMembership } from "@/server/auth/guards"
import { updateRoasterProfileAction } from "@/server/profiles/actions"
import { getRoasterProfile } from "@/server/profiles/service"

export default async function RoasterEditPage() {
  const session = await requireRoasterMembership()
  const roaster = await getRoasterProfile(session.roasterId!, session.id)

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ロースター編集</h1>
        </div>
      </section>
      <section className="page-card">
        <form
          action={updateRoasterProfileAction}
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
