import { SectionLayout } from "@/components/layout/SectionLayout"
import { buildRoastersRoutes } from "@/features/roasters"
import { requireRoasterMembership } from "@/server/auth/guards"
import { updateRoasterProfileAction } from "@/server/profiles/actions"
import { getRoasterProfile } from "@/server/profiles/service"

export default async function RoasterEditPage() {
  const session = await requireRoasterMembership()
  const routes = buildRoastersRoutes(session.roasterId)
  const roaster = await getRoasterProfile(session.roasterId!, session.id)

  return (
    <SectionLayout
      badge="Roasters"
      title="ロースター編集"
      description="所属ロースターの情報だけ更新できます。"
      links={routes}
    >
      <main className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)]">
        <form
          action={updateRoasterProfileAction}
          className="space-y-4"
        >
          <FormField
            label="ロースター名"
            name="name"
            defaultValue={roaster.name}
          />
          <FormField
            label="電話番号"
            name="phoneNumber"
            defaultValue={roaster.phone_number}
          />
          <FormField
            label="都道府県コード"
            name="prefectureCode"
            defaultValue={roaster.prefecture_code}
          />
          <FormField
            label="住所"
            name="address"
            defaultValue={roaster.address}
          />
          <label className="block space-y-2 text-sm font-medium">
            <span>紹介文</span>
            <textarea
              name="describe"
              defaultValue={roaster.describe ?? ""}
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

function FormField(props: { defaultValue: string; label: string; name: string }) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{props.label}</span>
      <input
        required
        type="text"
        name={props.name}
        defaultValue={props.defaultValue}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
      />
    </label>
  )
}
