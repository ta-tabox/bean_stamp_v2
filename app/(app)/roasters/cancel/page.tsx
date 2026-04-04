import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildRoastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth/guards"
import { deleteRoasterProfileAction } from "@/server/profiles/actions"

export default async function RoasterCancelPage() {
  const session = await requireRoasterMembership()
  const routes = buildRoastersRoutes(session.roasterId)

  return (
    <SectionLayout
      badge="Roasters"
      title="ロースター終了"
      description="所属ロースターの削除を実行します。"
      links={routes}
    >
      <main className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
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
      </main>
    </SectionLayout>
  )
}
