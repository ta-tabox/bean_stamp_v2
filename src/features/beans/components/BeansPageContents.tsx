"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { FormEvent, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/ui/StatusBanner"
import {
  BeanImagePicker as BeanImageFieldPicker,
  BeanTasteSliderField as BeanTasteFieldSlider,
  BeanTasteTagPicker as BeanTasteFieldTagPicker,
} from "@/features/beans/components/BeanFormFields"
import { countriesSeedData, roastLevelsSeedData, tasteTagsSeedData } from "@/server/db/seed-data"
import type { BeanApiResponse } from "@/server/beans"

type BeanFormPageContentProps = {
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
              className="page-card overflow-visible pt-0"
            >
              <div className="px-4 md:px-6">
                <div className="flex justify-center -mt-10 items-end md:justify-end">
                  <BeanThumbnail
                    beanName={bean.name}
                    imageUrl={bean.thumbnail_url}
                  />
                </div>

                <div className="mt-2 px-4 lg:flex lg:items-baseline lg:justify-between">
                  <h2 className="title-font pl-3 text-xl text-gray-800 lg:pl-0 lg:text-2xl">
                    {bean.name}
                  </h2>
                  <div className="mt-2 ml-4 flex justify-end gap-3">
                    <Link
                      href={`/offers/new?beanId=${bean.id}`}
                      className="btn btn-primary"
                    >
                      オファー
                    </Link>
                    <Link
                      href={`/beans/${bean.id}`}
                      className="btn btn-secondary"
                    >
                      詳細
                    </Link>
                    <Link
                      href={`/beans/${bean.id}/edit`}
                      className="btn btn-primary"
                    >
                      編集
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
                  <BeanImageStrip
                    beanName={bean.name}
                    imageUrls={bean.image_urls}
                  />

                  <div className="space-y-4">
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      {bean.describe ?? "紹介文はまだ登録されていません。"}
                    </p>

                    <BeanTasteTags
                      tastes={bean.taste.names}
                      centered={false}
                    />

                    <dl className="lg:grid lg:grid-cols-2 lg:content-between">
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
                  </div>
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
  status,
}: BeanDetailPageContentProps) {
  const deleteReadyRef = useRef(false)
  const deleteMarkerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    deleteReadyRef.current = true
    deleteMarkerRef.current?.setAttribute("data-form-ready", "1")
  }, [])

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    if (!deleteReadyRef.current) {
      return
    }

    event.preventDefault()

    const response = await fetch(`/api/v1/beans/${bean.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      window.location.assign("/beans?deleted=1")
      return
    }

    if (response.status === 401) {
      window.location.assign("/auth/signin")
      return
    }

    if (response.status === 403) {
      window.location.assign("/users/home")
      return
    }

    window.location.assign(
      `/beans/${bean.id}?error=${encodeURIComponent(await readErrorMessage(response))}`,
    )
  }

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
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="text-center">
            <p className="bean-section-title">〜 Beans 〜</p>
            <h2 className="title-font mt-2 text-3xl text-[var(--color-fg)]">{bean.name}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/beans"
              className="btn btn-secondary"
            >
              一覧へ戻る
            </Link>
            <Link
              href={`/offers/new?beanId=${bean.id}`}
              className="btn btn-primary"
            >
              この豆をオファーする
            </Link>
            <Link
              href={`/beans/${bean.id}/edit`}
              className="btn btn-secondary"
            >
              編集する
            </Link>
            <form
              action={`/api/v1/beans/${bean.id}`}
              method="post"
              onSubmit={handleDelete}
            >
              <div
                ref={deleteMarkerRef}
                data-form-ready="0"
                data-testid="bean-delete-form"
                hidden
              />
              <input
                type="hidden"
                name="_intent"
                value="delete"
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

        <div className="space-y-8">
          <BeanImageStrip
            beanName={bean.name}
            imageUrls={bean.image_urls}
            large
          />

          <div className="text-center text-sm leading-7 text-[var(--color-muted)]">
            {bean.describe ?? "紹介文はまだ登録されていません。"}
          </div>

          <section className="space-y-3 text-center">
            <h3 className="bean-section-title">〜 Flavor 〜</h3>
            <BeanTasteTags tastes={bean.taste.names} />
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <section>
              <h3 className="bean-section-title">〜 Detail 〜</h3>
              <dl className="mt-4 lg:grid lg:grid-cols-2 lg:content-between">
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
              <h3 className="bean-section-title">〜 Taste 〜</h3>
              <dl className="mt-4 space-y-4">
                <TasteMetricRow
                  label="酸味"
                  value={bean.acidity}
                />
                <TasteMetricRow
                  label="フレーバー"
                  value={bean.flavor}
                />
                <TasteMetricRow
                  label="ボディ"
                  value={bean.body}
                />
                <TasteMetricRow
                  label="苦味"
                  value={bean.bitterness}
                />
                <TasteMetricRow
                  label="甘味"
                  value={bean.sweetness}
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
  bean,
  error,
  submitLabel,
  title,
}: BeanFormPageContentProps) {
  const [clientError, setClientError] = useState(error ?? "")
  const formReadyRef = useRef(false)
  const formMarkerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    formReadyRef.current = true
    formMarkerRef.current?.setAttribute("data-form-ready", "1")
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!formReadyRef.current) {
      return
    }

    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const endpoint = bean ? `/api/v1/beans/${bean.id}` : "/api/v1/beans"
    const method = bean ? "PATCH" : "POST"

    setClientError("")

    const response = await fetch(endpoint, {
      body: formData,
      method,
    })

    if (response.ok) {
      if (bean) {
        window.location.assign(`/beans/${bean.id}?updated=1`)
        return
      }

      const payload = (await response.json()) as { id: number | string }
      window.location.assign(`/beans/${payload.id}?created=1`)
      return
    }

    if (response.status === 401) {
      window.location.assign("/auth/signin")
      return
    }

    if (response.status === 403) {
      window.location.assign("/users/home")
      return
    }

    setClientError(await readErrorMessage(response))
  }

  return (
    <main className="space-y-6">
      <ContentHeader title={title} />
      <section className="form-shell">
        {clientError ? <StatusBanner>{clientError}</StatusBanner> : null}
        <form
          action={bean ? `/api/v1/beans/${bean.id}` : "/api/v1/beans"}
          className="space-y-8"
          encType="multipart/form-data"
          method="post"
          onSubmit={handleSubmit}
        >
          <div
            ref={formMarkerRef}
            data-form-ready="0"
            data-testid="bean-mutation-form"
            hidden
          />
          {bean ? (
            <>
              <input
                type="hidden"
                name="_intent"
                value="update"
              />
              <input
                type="hidden"
                name="beanId"
                value={bean.id}
              />
            </>
          ) : null}

          <div className="text-center">
            <p className="bean-section-title">〜 Bean Form 〜</p>
          </div>

          <BeanImageFieldPicker
            beanName={bean?.name}
            existingImageUrls={bean?.image_urls ?? []}
          />

          <section className="space-y-6">
            <h2 className="bean-section-title">〜 Detail 〜</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Field>
                <span className="field-label">豆の名前</span>
                <input
                  required
                  type="text"
                  name="name"
                  defaultValue={bean?.name ?? ""}
                  className="field-input"
                  placeholder="タイトル"
                />
              </Field>

              <SelectField
                defaultValue={String(bean?.country.id ?? 0)}
                label="生産国"
                name="countryId"
                options={countryOptions.map((country) => ({
                  label: country.name,
                  value: String(country.id),
                }))}
              />

              <SelectField
                defaultValue={String(bean?.roast_level.id ?? 0)}
                label="焙煎度"
                name="roastLevelId"
                options={roastLevelOptions.map((roastLevel) => ({
                  label: roastLevel.name,
                  value: String(roastLevel.id),
                }))}
              />

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
                  placeholder="地域"
                />
              </Field>

              <Field>
                <span className="field-label">農園</span>
                <input
                  type="text"
                  name="farm"
                  defaultValue={bean?.farm ?? ""}
                  className="field-input"
                  placeholder="農園"
                />
              </Field>

              <Field>
                <span className="field-label">品種</span>
                <input
                  type="text"
                  name="variety"
                  defaultValue={bean?.variety ?? ""}
                  className="field-input"
                  placeholder="品種"
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
                  placeholder="標高"
                />
              </Field>

              <Field>
                <span className="field-label">精製方法</span>
                <input
                  type="text"
                  name="process"
                  defaultValue={bean?.process ?? ""}
                  className="field-input"
                  placeholder="精製方法"
                />
              </Field>

              <Field className="lg:col-span-2">
                <span className="field-label">紹介文</span>
                <textarea
                  name="describe"
                  rows={7}
                  defaultValue={bean?.describe ?? ""}
                  className="field-input"
                  placeholder="紹介文(300文字まで)"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="bean-section-title">〜 Taste 〜</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <BeanTasteFieldSlider
                defaultValue={bean?.acidity ?? 3}
                label="酸味"
                name="acidity"
              />
              <BeanTasteFieldSlider
                defaultValue={bean?.flavor ?? 3}
                label="フレーバー"
                name="flavor"
              />
              <BeanTasteFieldSlider
                defaultValue={bean?.body ?? 3}
                label="ボディ"
                name="body"
              />
              <BeanTasteFieldSlider
                defaultValue={bean?.bitterness ?? 3}
                label="苦味"
                name="bitterness"
              />
              <BeanTasteFieldSlider
                defaultValue={bean?.sweetness ?? 3}
                label="甘味"
                name="sweetness"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="bean-section-title">〜 Flavor 〜</h2>
            <BeanTasteFieldTagPicker
              initialSelectedIds={bean?.taste.ids ?? []}
              options={tasteTagOptions.map((tasteTag) => ({
                id: tasteTag.id,
                name: tasteTag.name,
              }))}
            />
          </section>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-[var(--color-border)] pt-6">
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
          className={`overflow-hidden rounded-lg bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${large ? "aspect-[4/3]" : "aspect-square"}`}
        >
          <img
            src={imageUrl}
            alt={`${beanName}の画像 ${index + 1}`}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  )
}

function BeanTasteTags({
  tastes,
  centered = true,
}: {
  tastes: readonly string[]
  centered?: boolean
}) {
  if (!tastes.length) {
    return (
      <p className="text-sm text-[var(--color-muted)]">フレーバータグはまだ設定されていません。</p>
    )
  }

  return (
    <div className={centered ? "mt-4 flex flex-wrap items-center justify-center gap-2" : "mt-4 flex flex-wrap gap-2"}>
      {tastes.map((taste) => (
        <span
          key={taste}
          className="bean-taste-chip"
        >
          {taste}
        </span>
      ))}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <dt className="text-sm font-medium text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--color-fg)]">{value}</dd>
    </div>
  )
}

function TasteMetricRow({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--color-fg)]">{label}</span>
        <span className="bean-slider-value">{value}</span>
      </div>
      <div className="bean-static-meter">
        <div
          className="bean-static-meter-fill"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  )
}

function BeanThumbnail({
  beanName,
  imageUrl,
}: {
  beanName: string
  imageUrl: string | null
}) {
  return (
    <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--color-accent)] bg-white shadow-[0_8px_20px_rgba(99,102,241,0.15)]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${beanName}のサムネイル`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Bean
        </div>
      )}
    </div>
  )
}

type ApiErrorPayload = {
  error?: {
    message?: string
  }
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as ApiErrorPayload

    return payload.error?.message ?? "入力内容を確認してください"
  } catch {
    return "入力内容を確認してください"
  }
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string
  label: string
  name: string
  options: readonly { label: string; value: string }[]
}) {
  return (
    <Field>
      <span className="field-label">{label}</span>
      <div className="bean-select-shell">
        <select
          required
          name={name}
          defaultValue={defaultValue}
          className="field-input bean-select-input pr-12"
        >
          <option value="0">選択してください</option>
          {options.map((option) => (
            <option
              key={`${name}-${option.value}`}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="bean-select-chevron">⌄</span>
      </div>
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
