import { SectionLayout } from "@/components/layout/SectionLayout"
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
      description="名前、メールアドレス、都道府県コード、自己紹介を更新できます。"
      links={routes}
    >
      <main className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
        <form
          action={updateUserProfileAction}
          className="space-y-4"
        >
          <FormField
            label="名前"
            name="name"
            defaultValue={user.name}
          />
          <FormField
            label="メールアドレス"
            name="email"
            type="email"
            defaultValue={user.email}
          />
          <FormField
            label="都道府県コード"
            name="prefectureCode"
            defaultValue={user.prefecture_code}
          />
          <label className="block space-y-2 text-sm font-medium">
            <span>自己紹介</span>
            <textarea
              name="describe"
              defaultValue={user.describe ?? ""}
              rows={5}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            更新する
          </button>
        </form>
      </main>
    </SectionLayout>
  )
}

function FormField(props: {
  defaultValue: string
  label: string
  name: string
  type?: "email" | "text"
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{props.label}</span>
      <input
        required
        type={props.type ?? "text"}
        name={props.name}
        defaultValue={props.defaultValue}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
      />
    </label>
  )
}
