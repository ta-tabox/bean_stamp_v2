import { requireSession } from "@/server/auth/guards"
import { deleteUserProfileAction } from "@/server/profiles/actions"

export default async function UserCancelPage() {
  await requireSession()

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ユーザー退会</h1>
        </div>
      </section>
      <section className="page-card border-rose-200 bg-rose-50">
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
      </section>
    </main>
  )
}
