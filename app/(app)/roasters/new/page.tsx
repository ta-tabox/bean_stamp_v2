import { requireNoRoasterMembership } from "@/server/auth/guards"
import { createRoasterProfileAction } from "@/server/profiles/actions"

export default async function RoasterNewPage() {
  await requireNoRoasterMembership()

  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full items-end justify-start">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ロースター新規作成</h1>
        </div>
      </section>
      <section className="page-card">
        <RoasterForm action={createRoasterProfileAction} />
      </section>
    </main>
  )
}

function RoasterForm(props: {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    address?: string
    describe?: string | null
    imageUrl?: string | null
    name?: string
    phoneNumber?: string
    prefectureCode?: string
  }
}) {
  const defaults = props.defaultValues ?? {}

  return (
    <form
      action={props.action}
      className="space-y-4"
    >
      <FormField
        label="ロースター名"
        name="name"
        defaultValue={defaults.name ?? ""}
      />
      <FormField
        label="電話番号"
        name="phoneNumber"
        defaultValue={defaults.phoneNumber ?? ""}
      />
      <FormField
        label="都道府県コード"
        name="prefectureCode"
        defaultValue={defaults.prefectureCode ?? ""}
      />
      <FormField
        label="住所"
        name="address"
        defaultValue={defaults.address ?? ""}
      />
      <FormField
        label="ロゴ画像 URL"
        name="imageUrl"
        type="url"
        required={false}
        defaultValue={defaults.imageUrl ?? ""}
      />
      <label className="block space-y-2 text-sm font-medium">
        <span>紹介文</span>
        <textarea
          name="describe"
          defaultValue={defaults.describe ?? ""}
          rows={5}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
      >
        保存する
      </button>
    </form>
  )
}

function FormField(props: {
  defaultValue: string
  label: string
  name: string
  required?: boolean
  type?: "text" | "url"
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{props.label}</span>
      <input
        required={props.required ?? true}
        type={props.type ?? "text"}
        name={props.name}
        defaultValue={props.defaultValue}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
      />
    </label>
  )
}
