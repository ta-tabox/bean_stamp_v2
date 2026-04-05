/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { ReactNode } from "react"

import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/profiles/ProfileUi"
import { countriesSeedData, roastLevelsSeedData, tasteTagsSeedData } from "@/server/db/seed-data"
import type { BeanApiResponse } from "@/server/beans"

type BeanFormPageContentProps = {
  action: (formData: FormData) => Promise<void>
  bean?: BeanApiResponse
  error?: string
  submitLabel: string
  title: string
}

type BeansListPageContentProps = {
  beans: readonly BeanApiResponse[]
  deleted?: boolean
}

type BeanDetailPageContentProps = {
  bean: BeanApiResponse
  deleteAction: (formData: FormData) => Promise<void>
  status?: {
    created?: boolean
    error?: string
    updated?: boolean
  }
}

const countryOptions = countriesSeedData.filter((country) => country.id > 0)
const roastLevelOptions = roastLevelsSeedData.filter((roastLevel) => roastLevel.id > 0)
const tasteTagOptions = tasteTagsSeedData.filter((tasteTag) => tasteTag.id > 0)

export function BeansListPageContent({ beans, deleted = false }: BeansListPageContentProps) {
  return (
    <main className="space-y-6">
      {deleted ? <StatusBanner>コーヒー豆を削除しました。</StatusBanner> : null}
      <ContentHeader title="コーヒー豆一覧" />

      <div className="flex justify-end">
        <Link
          href="/beans/new"
          className="btn btn-primary"
        >
          新規作成
        </Link>
      </div>

      {beans.length ? (
        <section className="space-y-6">
          {beans.map((bean) => (
            <article
              key={bean.id}
              className="page-card"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="lg:w-56">
                  <BeanImageStrip
                    beanName={bean.name}
                    imageUrls={bean.image_urls}
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="title-font text-2xl text-[var(--color-fg)]">{bean.name}</h2>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        {bean.describe ?? "紹介文はまだ登録されていません。"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/beans/${bean.id}`}
                        className="btn btn-secondary"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/beans/${bean.id}/edit`}
                        className="btn btn-secondary"
                      >
                        編集
                      </Link>
                    </div>
                  </div>

                  <dl className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                    <DetailRow
                      label="生産国"
                      value={bean.country.name}
                    />
                    <DetailRow
                      label="焙煎度"
                      value={bean.roast_level.name}
                    />
                    <DetailRow
                      label="地域"
                      value={bean.subregion ?? "未設定"}
                    />
                    <DetailRow
                      label="精製方法"
                      value={bean.process ?? "未設定"}
                    />
                  </dl>

                  <BeanTasteTags tastes={bean.taste.names} />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="page-card">
          <div className="empty-state">
            <h2 className="title-font text-2xl text-[var(--color-fg)]">
              コーヒー豆が登録されていません
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              まずはロースターの豆情報を登録して、詳細ページから内容を確認してください。
            </p>
            <Link
              href="/beans/new"
              className="btn btn-primary mt-5"
            >
              コーヒー豆を登録する
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}

export function BeanDetailPageContent({
  bean,
  deleteAction,
  status,
}: BeanDetailPageContentProps) {
  return (
    <main className="space-y-6">
      <StatusMessages
        messages={[
          status?.created ? "コーヒー豆を登録しました。" : null,
          status?.updated ? "コーヒー豆情報を変更しました。" : null,
          status?.error ?? null,
        ]}
      />
      <ContentHeader title="コーヒー豆詳細" />

      <section className="page-card space-y-6">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="panel-label">Beans</p>
            <h2 className="title-font mt-2 text-3xl text-[var(--color-fg)]">{bean.name}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              {bean.describe ?? "紹介文はまだ登録されていません。"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/beans"
              className="btn btn-secondary"
            >
              一覧へ戻る
            </Link>
            <Link
              href={`/beans/${bean.id}/edit`}
              className="btn btn-secondary"
            >
              編集する
            </Link>
            <form action={deleteAction}>
              <input
                type="hidden"
                name="beanId"
                value={bean.id}
              />
              <button
                type="submit"
                className="btn border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              >
                コーヒー豆を削除する
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <BeanImageStrip
            beanName={bean.name}
            imageUrls={bean.image_urls}
            large
          />

          <div className="space-y-6">
            <section>
              <h3 className="title-font text-xl text-[var(--color-fg)]">フレーバー</h3>
              <BeanTasteTags tastes={bean.taste.names} />
            </section>

            <section>
              <h3 className="title-font text-xl text-[var(--color-fg)]">詳細</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailRow
                  label="生産国"
                  value={bean.country.name}
                />
                <DetailRow
                  label="焙煎度"
                  value={bean.roast_level.name}
                />
                <DetailRow
                  label="地域"
                  value={bean.subregion ?? "未設定"}
                />
                <DetailRow
                  label="農園"
                  value={bean.farm ?? "未設定"}
                />
                <DetailRow
                  label="品種"
                  value={bean.variety ?? "未設定"}
                />
                <DetailRow
                  label="精製方法"
                  value={bean.process ?? "未設定"}
                />
                <DetailRow
                  label="標高"
                  value={bean.elevation === null ? "未設定" : `${bean.elevation} m`}
                />
                <DetailRow
                  label="収穫時期"
                  value={bean.cropped_at ?? "未設定"}
                />
              </dl>
            </section>

            <section>
              <h3 className="title-font text-xl text-[var(--color-fg)]">テイスト</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailRow
                  label="酸味"
                  value={`${bean.acidity} / 5`}
                />
                <DetailRow
                  label="フレーバー"
                  value={`${bean.flavor} / 5`}
                />
                <DetailRow
                  label="ボディ"
                  value={`${bean.body} / 5`}
                />
                <DetailRow
                  label="苦味"
                  value={`${bean.bitterness} / 5`}
                />
                <DetailRow
                  label="甘味"
                  value={`${bean.sweetness} / 5`}
                />
              </dl>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

export function BeanFormPageContent({
  action,
  bean,
  error,
  submitLabel,
  title,
}: BeanFormPageContentProps) {
  const selectedTasteIds = bean?.taste.ids.map(String) ?? []

  return (
    <main className="space-y-6">
      <ContentHeader title={title} />
      <section className="page-card">
        <form
          action={action}
          className="space-y-8"
        >
          {bean ? (
            <input
              type="hidden"
              name="beanId"
              value={bean.id}
            />
          ) : null}

          {error ? <StatusBanner>{error}</StatusBanner> : null}

          {bean?.image_urls.length ? (
            <div className="space-y-3">
              <h2 className="title-font text-xl text-[var(--color-fg)]">現在の画像</h2>
              <BeanImageStrip
                beanName={bean.name}
                imageUrls={bean.image_urls}
              />
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <Field>
              <span className="field-label">豆の名前</span>
              <input
                required
                type="text"
                name="name"
                defaultValue={bean?.name ?? ""}
                className="field-input"
              />
            </Field>

            <Field>
              <span className="field-label">生産国</span>
              <select
                required
                name="countryId"
                defaultValue={String(bean?.country.id ?? 0)}
                className="field-input"
              >
                <option value="0">選択してください</option>
                {countryOptions.map((country) => (
                  <option
                    key={country.id}
                    value={country.id}
                  >
                    {country.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <span className="field-label">焙煎度</span>
              <select
                required
                name="roastLevelId"
                defaultValue={String(bean?.roast_level.id ?? 0)}
                className="field-input"
              >
                <option value="0">選択してください</option>
                {roastLevelOptions.map((roastLevel) => (
                  <option
                    key={roastLevel.id}
                    value={roastLevel.id}
                  >
                    {roastLevel.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <span className="field-label">収穫時期</span>
              <input
                type="month"
                name="croppedAt"
                defaultValue={bean?.cropped_at ?? ""}
                className="field-input"
              />
            </Field>

            <Field>
              <span className="field-label">地域</span>
              <input
                type="text"
                name="subregion"
                defaultValue={bean?.subregion ?? ""}
                className="field-input"
              />
            </Field>

            <Field>
              <span className="field-label">農園</span>
              <input
                type="text"
                name="farm"
                defaultValue={bean?.farm ?? ""}
                className="field-input"
              />
            </Field>

            <Field>
              <span className="field-label">品種</span>
              <input
                type="text"
                name="variety"
                defaultValue={bean?.variety ?? ""}
                className="field-input"
              />
            </Field>

            <Field>
              <span className="field-label">標高</span>
              <input
                type="number"
                min="0"
                name="elevation"
                defaultValue={bean?.elevation ?? ""}
                className="field-input"
              />
            </Field>

            <Field>
              <span className="field-label">精製方法</span>
              <input
                type="text"
                name="process"
                defaultValue={bean?.process ?? ""}
                className="field-input"
              />
            </Field>

            <Field className="lg:col-span-2">
              <span className="field-label">紹介文</span>
              <textarea
                name="describe"
                rows={5}
                defaultValue={bean?.describe ?? ""}
                className="field-input"
              />
            </Field>

            <Field className="lg:col-span-2">
              <span className="field-label">フレーバータグ</span>
              <select
                required
                multiple
                size={10}
                name="tasteTagIds"
                defaultValue={selectedTasteIds}
                className="field-input min-h-52"
              >
                {tasteTagOptions.map((tasteTag) => (
                  <option
                    key={tasteTag.id}
                    value={tasteTag.id}
                  >
                    {tasteTag.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                2〜3個選択してください。Mac は `command`、Windows は `Ctrl` を押しながら複数選択できます。
              </p>
            </Field>

            <Field className="lg:col-span-2">
              <span className="field-label">画像</span>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                className="field-input py-3"
              />
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                最大4枚、各5MBまで。編集時に新しい画像を選択すると既存画像を置き換えます。
              </p>
            </Field>

            <TasteScoreField
              defaultValue={bean?.acidity ?? 3}
              label="酸味"
              name="acidity"
            />
            <TasteScoreField
              defaultValue={bean?.flavor ?? 3}
              label="フレーバー"
              name="flavor"
            />
            <TasteScoreField
              defaultValue={bean?.body ?? 3}
              label="ボディ"
              name="body"
            />
            <TasteScoreField
              defaultValue={bean?.bitterness ?? 3}
              label="苦味"
              name="bitterness"
            />
            <TasteScoreField
              defaultValue={bean?.sweetness ?? 3}
              label="甘味"
              name="sweetness"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--color-border)] pt-6">
            <Link
              href={bean ? `/beans/${bean.id}` : "/beans"}
              className="btn btn-secondary"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {submitLabel}
            </button>
          </div>
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

function BeanImageStrip({
  beanName,
  imageUrls,
  large = false,
}: {
  beanName: string
  imageUrls: readonly string[]
  large?: boolean
}) {
  if (!imageUrls.length) {
    return (
      <div className="detail-tile flex min-h-48 items-center justify-center text-sm text-[var(--color-muted)]">
        画像はまだ登録されていません
      </div>
    )
  }

  return (
    <div className={`grid gap-3 ${large ? "sm:grid-cols-2" : ""}`}>
      {imageUrls.map((imageUrl, index) => (
        <div
          key={`${beanName}-${index}`}
          className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-white ${large ? "aspect-[4/3]" : "aspect-square"}`}
        >
          <img
            src={imageUrl}
            alt={`${beanName}の画像 ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function BeanTasteTags({ tastes }: { tastes: readonly string[] }) {
  if (!tastes.length) {
    return (
      <p className="text-sm text-[var(--color-muted)]">フレーバータグはまだ設定されていません。</p>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tastes.map((taste) => (
        <span
          key={taste}
          className="metric-chip"
        >
          {taste}
        </span>
      ))}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-tile">
      <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-[var(--color-fg)]">{value}</dd>
    </div>
  )
}

function TasteScoreField({
  defaultValue,
  label,
  name,
}: {
  defaultValue: number
  label: string
  name: string
}) {
  return (
    <Field>
      <span className="field-label">{label}</span>
      <select
        name={name}
        defaultValue={String(defaultValue)}
        className="field-input"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <option
            key={`${name}-${value}`}
            value={value}
          >
            {value}
          </option>
        ))}
      </select>
    </Field>
  )
}

function Field({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <label className={className ? `field-row ${className}` : "field-row"}>{children}</label>
}
