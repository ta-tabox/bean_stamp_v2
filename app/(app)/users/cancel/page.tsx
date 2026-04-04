import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildUsersRoutes } from "@/features/users"
import { requireSession } from "@/server/auth/guards"
import { deleteUserProfileAction } from "@/server/profiles/actions"

export default async function UserCancelPage() {
  const session = await requireSession()
  const routes = buildUsersRoutes(session.id)

  return (
    <SectionLayout
      badge="Users"
      title="ユーザー退会"
      description="所属ロースターがない通常ユーザーのみ退会できます。"
      links={routes}
    >
      <main className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
        <h2 className="text-2xl font-semibold text-rose-900">アカウントを削除する</h2>
        <p className="mt-3 text-sm leading-7 text-rose-800">
          フォロー情報もあわせて削除されます。所属ロースターがある場合は先にロースター削除を行ってください。
        </p>
        <form
          action={deleteUserProfileAction}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
          >
            退会する
          </button>
        </form>
      </main>
    </SectionLayout>
  )
}
