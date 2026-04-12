"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/ui/StatusBanner"
import {
  hasMissingRequiredOfferFields,
  validateOfferForm,
  type OfferFormErrors,
  type OfferFormField,
  type OfferFormValues,
} from "@/features/offers/components/offer-form-validation"
import type { OfferApiResponse, OffersStatsApiResponse } from "@/server/offers"
import type { UserApiResponse } from "@/server/profiles/dto"

type WritableBeanOption = {
  id: number
  name: string
}

type OffersListPageContentProps = {
  deleted?: boolean
  offers: readonly OfferApiResponse[]
  stats: OffersStatsApiResponse
  statusFilter?: string
}

type OfferDetailPageContentProps = {
  canManage: boolean
  offer: OfferApiResponse
  status?: {
    created?: boolean
    error?: string
    updated?: boolean
  }
}

type OfferFormPageContentProps = {
  beans: readonly WritableBeanOption[]
  defaultBeanId?: string
  error?: string
  offer?: OfferApiResponse
  submitLabel: string
  title: string
}

type OfferWantedUsersPageContentProps = {
  offer: OfferApiResponse
  users: readonly UserApiResponse[]
}

const offerStatusLabel: Record<OfferApiResponse["status"], string> = {
  end_of_sales: "受け取り終了",
  on_offering: "オファー中",
  on_preparing: "準備中",
  on_roasting: "ロースト期間",
  on_selling: "受け取り期間",
}

const offerStatusClassName: Record<OfferApiResponse["status"], string> = {
  end_of_sales: "bg-slate-100 text-slate-700 border-slate-200",
  on_offering: "bg-sky-50 text-sky-700 border-sky-200",
  on_preparing: "bg-amber-50 text-amber-700 border-amber-200",
  on_roasting: "bg-emerald-50 text-emerald-700 border-emerald-200",
  on_selling: "bg-rose-50 text-rose-700 border-rose-200",
}

export function OffersListPageContent({
  deleted = false,
  offers,
  stats,
  statusFilter,
}: OffersListPageContentProps) {
  return (
    <main className="space-y-6">
      {deleted ? <StatusBanner>オファーを削除しました。</StatusBanner> : null}
      <ContentHeader title="オファー一覧" />

      <section className="grid gap-3 md:grid-cols-5">
        <StatsTile
          label="オファー中"
          value={stats.on_offering}
        />
        <StatsTile
          label="ロースト期間"
          value={stats.on_roasting}
        />
        <StatsTile
          label="準備中"
          value={stats.on_preparing}
        />
        <StatsTile
          label="受け取り期間"
          value={stats.on_selling}
        />
        <StatsTile
          label="受け取り終了"
          value={stats.end_of_sales}
        />
      </section>

      <section className="page-card space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <form
            action="/offers"
            method="get"
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <label className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
              ステータス
              <select
                name="status"
                defaultValue={statusFilter ?? ""}
                className="bean-select-input rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-fg)]"
              >
                <option value="">有効なオファーを表示</option>
                <option value="on_offering">オファー中</option>
                <option value="on_roasting">ロースト期間</option>
                <option value="on_preparing">準備中</option>
                <option value="on_selling">受け取り期間</option>
                <option value="end_of_sales">受け取り終了</option>
              </select>
            </label>
            <button
              type="submit"
              className="btn btn-secondary"
            >
              絞り込む
            </button>
          </form>

          <Link
            href="/offers/new"
            className="btn btn-primary"
          >
            新規オファー
          </Link>
        </div>
      </section>

      {offers.length ? (
        <section className="space-y-6">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="page-card overflow-hidden"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <OfferStatusBadge status={offer.status} />
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]">
                      Wants {offer.want.count} / {offer.amount}
                    </span>
                    <Link
                      href={`/roasters/${offer.roaster.id}`}
                      className="legacy-text-link text-sm"
                    >
                      {offer.roaster.name}
                    </Link>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="title-font text-2xl text-[var(--color-fg)]">
                        {offer.bean.name}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        {offer.bean.describe ?? "説明はまだ登録されていません。"}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/offers/${offer.id}`}
                        className="btn btn-secondary"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/offers/${offer.id}/edit`}
                        className="btn btn-primary"
                      >
                        編集
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <DetailTile
                      label="オファー終了日"
                      value={formatJaDate(offer.ended_at)}
                    />
                    <DetailTile
                      label="焙煎日"
                      value={formatJaDate(offer.roasted_at)}
                    />
                    <DetailTile
                      label="受け取り開始日"
                      value={formatJaDate(offer.receipt_started_at)}
                    />
                    <DetailTile
                      label="受け取り終了日"
                      value={formatJaDate(offer.receipt_ended_at)}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <DetailTile
                      label="内容量"
                      value={`${offer.weight}g`}
                    />
                    <DetailTile
                      label="価格"
                      value={`¥${offer.price.toLocaleString("ja-JP")}`}
                    />
                    <DetailTile
                      label="フレーバー"
                      value={offer.bean.taste.names.join(", ") || "未設定"}
                    />
                  </div>
                </div>

                <OfferImagePanel offer={offer} />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="page-card">
          <div className="empty-state">
            <h2 className="title-font text-2xl text-[var(--color-fg)]">オファーがありません</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              豆を選んでオファーを登録すると、一覧と詳細ページに表示されます。
            </p>
            <Link
              href="/offers/new"
              className="btn btn-primary mt-5"
            >
              オファーを登録する
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}

export function OfferDetailPageContent({
  canManage,
  offer,
  status,
}: OfferDetailPageContentProps) {
  const canEdit = canManage && todayKey() < offer.ended_at
  const deleteReadyRef = useRef(false)
  const deleteMarkerRef = useRef<HTMLDivElement>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    deleteReadyRef.current = true
    deleteMarkerRef.current?.setAttribute("data-form-ready", "1")
  }, [])

  async function handleDelete() {
    if (!deleteReadyRef.current) {
      return
    }
    setIsDeleting(true)

    const response = await fetch(`/api/v1/offers/${offer.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      window.location.assign("/offers?deleted=1")
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
      `/offers/${offer.id}?error=${encodeURIComponent(await readErrorMessage(response))}`,
    )
  }

  return (
    <main className="space-y-6">
      <StatusMessages
        messages={[
          status?.created ? "オファーを登録しました。" : null,
          status?.updated ? "オファー情報を更新しました。" : null,
          status?.error ?? null,
        ]}
      />
      <ContentHeader title="オファー詳細" />

      <section className="page-card space-y-6">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <OfferStatusBadge status={offer.status} />
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]">
              Wants {offer.want.count} / {offer.amount}
            </span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="bean-section-title text-left">〜 Offer 〜</p>
              <h2 className="title-font mt-2 text-3xl text-[var(--color-fg)]">{offer.bean.name}</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/offers"
                className="btn btn-secondary"
              >
                一覧へ戻る
              </Link>
              {canManage ? (
                <>
                  <Link
                    href={`/offers/${offer.id}/wanted_users`}
                    className="btn btn-secondary"
                  >
                    Wanted users
                  </Link>
                  {canEdit ? (
                    <Link
                      href={`/offers/${offer.id}/edit`}
                      className="btn btn-primary"
                    >
                      編集する
                    </Link>
                  ) : null}
                  <div
                    ref={deleteMarkerRef}
                    data-form-ready="0"
                    data-testid="offer-delete-form"
                    hidden
                  />
                  <button
                    type="button"
                    onClick={() => {
                      void handleDelete()
                    }}
                    disabled={isDeleting}
                    className="btn border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  >
                    オファーを削除する
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailTile
                label="オファー終了日"
                value={formatJaDate(offer.ended_at)}
              />
              <DetailTile
                label="焙煎日"
                value={formatJaDate(offer.roasted_at)}
              />
              <DetailTile
                label="受け取り開始日"
                value={formatJaDate(offer.receipt_started_at)}
              />
              <DetailTile
                label="受け取り終了日"
                value={formatJaDate(offer.receipt_ended_at)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailTile
                label="内容量"
                value={`${offer.weight}g`}
              />
              <DetailTile
                label="価格"
                value={`¥${offer.price.toLocaleString("ja-JP")}`}
              />
              <DetailTile
                label="登録日"
                value={formatJaDate(offer.created_at)}
              />
            </div>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/roasters/${offer.roaster.id}`}
                  className="legacy-text-link"
                >
                  {offer.roaster.name}
                </Link>
                <span className="metric-chip">Roaster</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <DetailTile
                  label="生産国"
                  value={offer.bean.country.name}
                />
                <DetailTile
                  label="焙煎度"
                  value={offer.bean.roast_level.name}
                />
                <DetailTile
                  label="フレーバー"
                  value={offer.bean.taste.names.join(", ") || "未設定"}
                />
              </div>

              <div className="detail-tile">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Bean note</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-fg)]">
                  {offer.bean.describe ?? "豆の紹介文はまだ登録されていません。"}
                </p>
              </div>
            </section>
          </div>

          <OfferImagePanel offer={offer} />
        </div>
      </section>
    </main>
  )
}

export function OfferFormPageContent({
  beans,
  defaultBeanId,
  error,
  offer,
  submitLabel,
  title,
}: OfferFormPageContentProps) {
  const [formValues, setFormValues] = useState<OfferFormValues>(() => ({
    amount: String(offer?.amount ?? ""),
    beanId: defaultBeanId ?? String(offer?.bean_id ?? ""),
    endedAt: offer?.ended_at ?? "",
    price: String(offer?.price ?? ""),
    receiptEndedAt: offer?.receipt_ended_at ?? "",
    receiptStartedAt: offer?.receipt_started_at ?? "",
    roastedAt: offer?.roasted_at ?? "",
    weight: String(offer?.weight ?? ""),
  }))
  const [fieldErrors, setFieldErrors] = useState<OfferFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(error ?? null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const submitReadyRef = useRef(false)
  const submitMarkerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedBean = beans.find((bean) => String(bean.id) === formValues.beanId)
  const requireBeanSelection = !offer
  const isSubmitDisabled =
    isSubmitting || hasMissingRequiredOfferFields(formValues, requireBeanSelection)
  const summaryMessages = buildOfferFormSummaryMessages(fieldErrors, submitError)

  useEffect(() => {
    submitReadyRef.current = true
    submitMarkerRef.current?.setAttribute("data-form-ready", "1")
  }, [])

  async function handleSubmit() {
    if (!submitReadyRef.current) {
      return
    }

    setHasAttemptedSubmit(true)
    setSubmitError(null)

    const validationErrors = validateOfferForm(formValues, {
      requireBeanSelection,
    })

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    const formData = buildOfferFormData(formValues)
    const response = await fetch(offer ? `/api/v1/offers/${offer.id}` : "/api/v1/offers", {
      body: formData,
      method: offer ? "PATCH" : "POST",
    })

    if (response.ok) {
      if (offer) {
        window.location.assign(`/offers/${offer.id}?updated=1`)
        return
      }

      const payload = (await response.json()) as { id: number }
      window.location.assign(`/offers/${payload.id}?created=1`)
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

    setIsSubmitting(false)
    setSubmitError(await readErrorMessage(response))
  }

  function handleFieldChange(field: OfferFormField, value: string) {
    const nextValues = {
      ...formValues,
      [field]: value,
    }

    setFormValues(nextValues)
    setSubmitError(null)

    if (!hasAttemptedSubmit) {
      if (fieldErrors[field]) {
        setFieldErrors((current) => ({
          ...current,
          [field]: undefined,
        }))
      }
      return
    }

    setFieldErrors(
      validateOfferForm(nextValues, {
        requireBeanSelection,
      }),
    )
  }

  return (
    <main className="space-y-6">
      {summaryMessages.length ? (
        <StatusBanner>
          <div className="space-y-2">
            <p className="font-medium">入力内容を確認してください。</p>
            <ul className="list-disc pl-5">
              {summaryMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        </StatusBanner>
      ) : null}
      <ContentHeader title={title} />

      {beans.length ? (
        <form
          className="form-shell space-y-8"
        >
          <div
            ref={submitMarkerRef}
            data-form-ready="0"
            data-testid="offer-mutation-form"
            hidden
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {offer ? (
              <div className="detail-tile">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Bean</p>
                <p className="mt-3 text-lg text-[var(--color-fg)]">
                  {selectedBean?.name ?? offer.bean.name}
                </p>
                <input
                  type="hidden"
                  name="beanId"
                  value={offer.bean_id}
                />
              </div>
            ) : (
              <Field>
                <label
                  htmlFor="beanId"
                  className="text-sm font-medium text-[var(--color-fg)]"
                >
                  コーヒー豆
                </label>
                <select
                  id="beanId"
                  name="beanId"
                  value={formValues.beanId}
                  onChange={(event) => {
                    handleFieldChange("beanId", event.target.value)
                  }}
                  aria-invalid={fieldErrors.beanId ? "true" : "false"}
                  className={buildFieldClassName(fieldErrors.beanId)}
                >
                  <option value="">選択してください</option>
                  {beans.map((bean) => (
                    <option
                      key={bean.id}
                      value={bean.id}
                    >
                      {bean.name}
                    </option>
                  ))}
                </select>
                <FieldErrorMessage message={fieldErrors.beanId} />
              </Field>
            )}

            <Field>
              <label
                htmlFor="price"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                価格
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                value={formValues.price}
                onChange={(event) => {
                  handleFieldChange("price", event.target.value)
                }}
                aria-invalid={fieldErrors.price ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.price)}
              />
              <FieldErrorMessage message={fieldErrors.price} />
            </Field>

            <Field>
              <label
                htmlFor="weight"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                内容量(g)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="1"
                value={formValues.weight}
                onChange={(event) => {
                  handleFieldChange("weight", event.target.value)
                }}
                aria-invalid={fieldErrors.weight ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.weight)}
              />
              <FieldErrorMessage message={fieldErrors.weight} />
            </Field>

            <Field>
              <label
                htmlFor="amount"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                数量
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                value={formValues.amount}
                onChange={(event) => {
                  handleFieldChange("amount", event.target.value)
                }}
                aria-invalid={fieldErrors.amount ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.amount)}
              />
              <FieldErrorMessage message={fieldErrors.amount} />
            </Field>

            <Field>
              <label
                htmlFor="endedAt"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                オファー終了日
              </label>
              <input
                id="endedAt"
                name="endedAt"
                type="date"
                value={formValues.endedAt}
                onChange={(event) => {
                  handleFieldChange("endedAt", event.target.value)
                }}
                aria-invalid={fieldErrors.endedAt ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.endedAt)}
              />
              <FieldErrorMessage message={fieldErrors.endedAt} />
            </Field>

            <Field>
              <label
                htmlFor="roastedAt"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                焙煎日
              </label>
              <input
                id="roastedAt"
                name="roastedAt"
                type="date"
                value={formValues.roastedAt}
                onChange={(event) => {
                  handleFieldChange("roastedAt", event.target.value)
                }}
                aria-invalid={fieldErrors.roastedAt ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.roastedAt)}
              />
              <FieldErrorMessage message={fieldErrors.roastedAt} />
            </Field>

            <Field>
              <label
                htmlFor="receiptStartedAt"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                受け取り開始日
              </label>
              <input
                id="receiptStartedAt"
                name="receiptStartedAt"
                type="date"
                value={formValues.receiptStartedAt}
                onChange={(event) => {
                  handleFieldChange("receiptStartedAt", event.target.value)
                }}
                aria-invalid={fieldErrors.receiptStartedAt ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.receiptStartedAt)}
              />
              <FieldErrorMessage message={fieldErrors.receiptStartedAt} />
            </Field>

            <Field>
              <label
                htmlFor="receiptEndedAt"
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                受け取り終了日
              </label>
              <input
                id="receiptEndedAt"
                name="receiptEndedAt"
                type="date"
                value={formValues.receiptEndedAt}
                onChange={(event) => {
                  handleFieldChange("receiptEndedAt", event.target.value)
                }}
                aria-invalid={fieldErrors.receiptEndedAt ? "true" : "false"}
                className={buildFieldClassName(fieldErrors.receiptEndedAt)}
              />
              <FieldErrorMessage message={fieldErrors.receiptEndedAt} />
            </Field>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={offer ? `/offers/${offer.id}` : "/offers"}
              className="btn btn-secondary"
            >
              キャンセル
            </Link>
            <button
              type="button"
              onClick={() => {
                void handleSubmit()
              }}
              disabled={isSubmitDisabled}
              className="btn btn-primary"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      ) : (
        <section className="page-card">
          <div className="empty-state">
            <h2 className="title-font text-2xl text-[var(--color-fg)]">
              先にコーヒー豆を登録してください
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              オファーはロースターが所有する豆に対してのみ作成できます。
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

export function OfferWantedUsersPageContent({
  offer,
  users,
}: OfferWantedUsersPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="Wanted users" />

      <section className="page-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-6">
          <div>
            <OfferStatusBadge status={offer.status} />
            <h2 className="title-font mt-3 text-2xl text-[var(--color-fg)]">{offer.bean.name}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Wants {offer.want.count} / {offer.amount}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/offers/${offer.id}`}
              className="btn btn-secondary"
            >
              オファー詳細
            </Link>
            <Link
              href="/offers"
              className="btn btn-secondary"
            >
              一覧へ戻る
            </Link>
          </div>
        </div>

        {users.length ? (
          <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-xl border border-[var(--color-border)]">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="list-item-link"
              >
                <div>
                  <p className="text-base text-[var(--color-fg)]">{user.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{user.email}</p>
                </div>
                <span className="metric-chip">{user.prefecture_code}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="title-font text-2xl text-[var(--color-fg)]">
              Wanted users はまだいません
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              ユーザーがオファーをウォントすると、この画面に一覧表示されます。
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function StatusMessages({ messages }: { messages: Array<string | null | undefined> }) {
  const visibleMessages = messages.filter((message): message is string => Boolean(message))

  if (!visibleMessages.length) {
    return null
  }

  return (
    <div className="space-y-3">
      {visibleMessages.map((message) => (
        <StatusBanner key={message}>{message}</StatusBanner>
      ))}
    </div>
  )
}

function OfferStatusBadge({ status }: { status: OfferApiResponse["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${offerStatusClassName[status]}`}
    >
      {offerStatusLabel[status]}
    </span>
  )
}

function OfferImagePanel({ offer }: { offer: OfferApiResponse }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        {offer.bean.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.bean.thumbnail_url}
            alt={`${offer.bean.name}の画像`}
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="flex h-72 items-center justify-center bg-slate-50 text-sm text-[var(--color-muted)]">
            No Image
          </div>
        )}
      </div>

      <div className="detail-tile">
        <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Bean profile</p>
        <dl className="mt-3 space-y-3 text-sm text-[var(--color-fg)]">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted)]">生産国</dt>
            <dd>{offer.bean.country.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted)]">焙煎度</dt>
            <dd>{offer.bean.roast_level.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted)]">フレーバー</dt>
            <dd className="text-right">{offer.bean.taste.names.join(", ") || "未設定"}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function StatsTile({ label, value }: { label: string; value: number }) {
  return (
    <section className="detail-tile">
      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">{label}</p>
      <p className="title-font mt-3 text-3xl text-[var(--color-fg)]">{value}</p>
    </section>
  )
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <section className="detail-tile">
      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">{label}</p>
      <p className="mt-3 text-base text-[var(--color-fg)]">{value}</p>
    </section>
  )
}

function Field({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-[var(--color-border)] bg-slate-50 p-4">{children}</div>
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-2 text-sm text-rose-700">{message}</p>
}

function formatJaDate(value: string) {
  const [year, month, date] = value.split("-")

  return `${year}年${Number(month)}月${Number(date)}日`
}

function todayKey() {
  const now = new Date()

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as {
      error?: {
        message?: string
      }
    }

    return payload.error?.message ?? "入力内容を確認してください"
  } catch {
    return "入力内容を確認してください"
  }
}

function buildFieldClassName(message?: string) {
  return `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[var(--color-fg)] ${
    message ? "border-rose-300 bg-rose-50/40" : "border-[var(--color-border)]"
  }`
}

function buildOfferFormData(values: OfferFormValues) {
  const formData = new FormData()

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value)
  }

  return formData
}

function buildOfferFormSummaryMessages(errors: OfferFormErrors, submitError: string | null) {
  const messages = [...new Set(Object.values(errors).filter((value): value is string => Boolean(value)))]

  if (submitError) {
    messages.unshift(submitError)
  }

  return [...new Set(messages)]
}
