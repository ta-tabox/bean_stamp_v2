import { requireRoasterMembership } from "@/server/auth/guards"
import { deleteRoasterProfileAction } from "@/server/profiles/actions"

export default async function RoasterCancelPage() {
  await requireRoasterMembership()

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ロースター終了</h1>
        </div>
      </section>
      <section className="page-card border-rose-200 bg-rose-50">
        <h2 className="text-2xl font-semibold text-rose-900">ロースターを削除する</h2>
        <p className="mt-3 text-sm leading-7 text-rose-800">
          フォロー関係も同時に削除されます。Bean や Offer が紐付く場合は削除できないことがあります。
        </p>
        <form
          action={deleteRoasterProfileAction}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
          >
            ロースターを削除する
          </button>
        </form>
      </section>
    </main>
  )
}
