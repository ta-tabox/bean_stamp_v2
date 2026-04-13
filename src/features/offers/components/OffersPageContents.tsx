"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/ui/StatusBanner"
import { OfferEngagementPanel } from "@/features/offers/components/OfferEngagementPanel"
import {
  hasMissingRequiredOfferFields,
  validateOfferForm,
  type OfferFormErrors,
  type OfferFormField,
  type OfferFormValues,
} from "@/features/offers/components/offer-form-validation"
import type { OfferApiResponse } from "@/server/offers"
import type { UserApiResponse } from "@/server/profiles/dto"

type WritableBeanOption = {
  id: number
  name: string
}

type OffersListPageContentProps = {
  deleted?: boolean
  offers: readonly OfferApiResponse[]
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
  statusFilter,
}: OffersListPageContentProps) {
  return (
    <main className="space-y-6">
      {deleted ? <StatusBanner>オファーを削除しました。</StatusBanner> : null}
      <section className="content-header-panel">
        <div className="flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">オファー 一覧</h1>
          <form
            action="/offers"
            method="get"
            className="ml-auto flex flex-col gap-2 text-left"
          >
            <label className="text-sm font-medium text-[var(--color-muted)]">ステータス</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <select
                name="status"
                defaultValue={statusFilter ?? ""}
                className="bean-select-input min-w-56 rounded-md border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm focus:outline-none"
              >
                <option value="">有効なオファーを表示</option>
                <option value="on_offering">オファー中</option>
                <option value="on_roasting">ロースト期間</option>
                <option value="on_preparing">準備中</option>
                <option value="on_selling">受け取り期間</option>
                <option value="end_of_sales">受け取り終了</option>
              </select>
              <button
                type="submit"
                className="btn btn-secondary"
              >
                絞り込む
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="pt-4 pb-8 text-center">
        <Link
          href="/beans"
          className="btn btn-primary"
        >
          コーヒー豆をオファーする
        </Link>
      </div>

      {offers.length ? (
        <section className="space-y-16">
          {offers.map((offer) => (
            <OfferIndexCard
              key={offer.id}
              offer={offer}
            />
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
              href="/beans"
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

export function OfferDetailPageContent({ canManage, offer, status }: OfferDetailPageContentProps) {
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

      <div className="flex flex-wrap justify-end gap-3">
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
              ウォントしたユーザー
            </Link>
            {canEdit ? (
              <Link
                href={`/offers/${offer.id}/edit`}
                className="btn btn-primary"
              >
                編集
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
              削除
            </button>
          </>
        ) : null}
      </div>

      <section className="mt-16">
        <OfferDetailSummaryCard
          canInteract={!canManage}
          offer={offer}
          showWantedUsersLink={canManage}
        />
      </section>
      <section className="mt-8">
        <OfferBeanInfoCard offer={offer} />
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
        <form className="mx-auto max-w-3xl space-y-4">
          <div
            ref={submitMarkerRef}
            data-form-ready="0"
            data-testid="offer-mutation-form"
            hidden
          />
          <div className="space-y-4">
            {offer ? (
              <div>
                <label className="text-sm font-medium text-gray-500">コーヒー豆</label>
                <div className="mt-3 rounded-md border border-gray-100 bg-white px-4 py-3 text-gray-600 shadow-sm">
                  {selectedBean?.name ?? offer.bean.name}
                </div>
                <input
                  type="hidden"
                  name="beanId"
                  value={offer.bean_id}
                />
              </div>
            ) : (
              <OfferFormField>
                <label
                  htmlFor="beanId"
                  className="text-sm font-medium text-gray-500"
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
              </OfferFormField>
            )}

            <OfferFormField>
              <label
                htmlFor="endedAt"
                className="text-sm font-medium text-gray-500"
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
            </OfferFormField>

            <OfferFormField>
              <label
                htmlFor="roastedAt"
                className="text-sm font-medium text-gray-500"
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
            </OfferFormField>

            <OfferFormField>
              <label
                htmlFor="receiptStartedAt"
                className="text-sm font-medium text-gray-500"
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
            </OfferFormField>

            <OfferFormField>
              <label
                htmlFor="receiptEndedAt"
                className="text-sm font-medium text-gray-500"
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
            </OfferFormField>

            <div className="grid gap-5 md:grid-cols-3">
              <OfferFormField>
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-500"
                >
                  価格
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  value={formValues.price}
                  placeholder="販売価格（円）"
                  onChange={(event) => {
                    handleFieldChange("price", event.target.value)
                  }}
                  aria-invalid={fieldErrors.price ? "true" : "false"}
                  className={buildFieldClassName(fieldErrors.price)}
                />
                <FieldErrorMessage message={fieldErrors.price} />
              </OfferFormField>

              <OfferFormField>
                <label
                  htmlFor="weight"
                  className="text-sm font-medium text-gray-500"
                >
                  内容量(g)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="1"
                  value={formValues.weight}
                  placeholder="内容量（g）"
                  onChange={(event) => {
                    handleFieldChange("weight", event.target.value)
                  }}
                  aria-invalid={fieldErrors.weight ? "true" : "false"}
                  className={buildFieldClassName(fieldErrors.weight)}
                />
                <FieldErrorMessage message={fieldErrors.weight} />
              </OfferFormField>

              <OfferFormField>
                <label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-500"
                >
                  数量
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  value={formValues.amount}
                  placeholder="数量"
                  onChange={(event) => {
                    handleFieldChange("amount", event.target.value)
                  }}
                  aria-invalid={fieldErrors.amount ? "true" : "false"}
                  className={buildFieldClassName(fieldErrors.amount)}
                />
                <FieldErrorMessage message={fieldErrors.amount} />
              </OfferFormField>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
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

export function OfferWantedUsersPageContent({ offer, users }: OfferWantedUsersPageContentProps) {
  return (
    <main className="space-y-6">
      <ContentHeader title="ウォントしたユーザー" />

      <section className="mt-16">
        <OfferDetailSummaryCard offer={offer} />
      </section>

      {users.length ? (
        <section className="page-card overflow-hidden py-4 text-[var(--color-fg)]">
          <ol>
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/users/${user.id}`}
                  className="list-item-link"
                >
                  <div className="flex items-center gap-4">
                    <UserThumbnail user={user} />
                    <div>
                      <p className="text-base">{user.name}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">{user.email}</p>
                    </div>
                  </div>
                  <span className="metric-chip">{user.prefecture_code}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="page-card">
          <div className="empty-state">
            <h2 className="title-font text-2xl text-[var(--color-fg)]">
              ウォントしているユーザーがいません
            </h2>
          </div>
        </section>
      )}
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

function OfferIndexCard({ offer }: { offer: OfferApiResponse }) {
  return (
    <article className="overflow-visible rounded-lg border border-gray-100 bg-white py-2 shadow-md">
      <div className="px-4 md:px-8">
        <div className="mx-auto w-11/12">
          <div className="flex -mt-16 items-end justify-center md:justify-end">
            <BeanThumbnail offer={offer} />
          </div>
          <div className="mb-2 flex items-end justify-between">
            <OfferStatusBadge status={offer.status} />
            <WantedUsersStat
              offer={offer}
              linked
            />
          </div>
          {offer.status === "on_offering" ? (
            <p className="text-right text-sm text-[var(--color-muted)]">
              焙煎まであと{getNumberOfDaysFromTodayTo(offer.roasted_at)}日です
            </p>
          ) : null}
          <div className="md:flex md:items-baseline">
            <h2 className="title-font text-xl text-[var(--color-fg)] md:mt-2 lg:text-2xl">
              {offer.bean.name}
            </h2>
            <div className="mt-3 text-right md:mt-0 md:ml-4">
              <Link
                href={`/offers/${offer.id}`}
                className="btn btn-secondary btn-compact w-20 md:w-auto"
              >
                詳細
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:grid lg:grid-cols-2 lg:content-between">
          <OfferBeanProfile offer={offer} />
          <OfferSchedulePanel offer={offer} />
          <div className="col-span-full flex justify-end pr-2 pt-4">
            <OfferPricePerWeight offer={offer} />
          </div>
        </div>
      </div>
    </article>
  )
}

export function OfferDetailSummaryCard({
  offer,
  canInteract = false,
  showWantedUsersLink = false,
}: {
  offer: OfferApiResponse
  canInteract?: boolean
  showWantedUsersLink?: boolean
}) {
  return (
    <section className="overflow-visible rounded-lg border border-gray-100 bg-white py-2 shadow-md">
      <div className="px-4 md:px-8">
        <div className="mx-auto w-11/12">
          <div className="flex -mt-16 justify-center md:justify-end">
            <RoasterThumbnail offer={offer} />
          </div>
          <div className="mb-2 flex justify-between">
            <OfferStatusBadge status={offer.status} />
            <div className="ml-auto w-2/3 text-right md:w-1/3">
              <Link
                href={`/roasters/${offer.roaster.id}`}
                className="legacy-text-link text-sm"
              >
                {offer.roaster.name}
              </Link>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full">
              {canInteract ? (
                <OfferEngagementPanel
                  amount={offer.amount}
                  beanName={offer.bean.name}
                  canInteract
                  initialLikeId={offer.like.id}
                  initialWantCount={offer.want.count}
                  initialWantId={offer.want.id}
                  offerId={offer.id}
                  receiptStartedAt={offer.receipt_started_at}
                  wantActionEnabled={offer.status === "on_offering"}
                />
              ) : (
                <div className="mr-4 flex justify-end">
                  <WantedUsersStat
                    offer={offer}
                    linked={showWantedUsersLink}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 lg:grid lg:grid-cols-2 lg:content-between">
          <OfferSchedulePanel offer={offer} />
          <div className="col-span-full flex justify-end pr-2 pt-4">
            <OfferPricePerWeight offer={offer} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function OfferBeanInfoCard({ offer }: { offer: OfferApiResponse }) {
  return (
    <section className="rounded-lg border border-gray-100 bg-white py-4 shadow-md">
      <div className="w-11/12 mx-auto">
        <h2 className="title-font pb-2 text-center text-xl text-gray-900 lg:text-2xl">
          {offer.bean.name}
        </h2>
        <div className="flex flex-col items-center justify-center">
          <div className="h-64 w-full overflow-hidden rounded-md border border-gray-100 bg-white lg:h-96 lg:w-[36rem]">
            <OfferImagePanel offer={offer} />
          </div>

          <div className="w-full pt-4 text-center lg:w-10/12">
            <p className="leading-relaxed text-[var(--color-fg)]">
              {offer.bean.describe ?? "豆の紹介文はまだ登録されていません。"}
            </p>

            <section className="w-11/12 mx-auto pt-4">
              <div className="bean-section-title mb-2">〜 Flavor 〜</div>
              <p className="text-sm leading-7 text-[var(--color-fg)]">
                {offer.bean.taste.names.join(", ") || "未設定"}
              </p>
            </section>

            <section className="pt-4">
              <div className="bean-section-title mb-2">〜 Detail 〜</div>
              <div className="lg:grid lg:grid-cols-2 lg:content-between">
                <OfferBeanDetailRows offer={offer} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferImagePanel({ offer }: { offer: OfferApiResponse }) {
  return (
    <div className="h-full overflow-hidden rounded-md bg-white">
      {offer.bean.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={offer.bean.thumbnail_url}
          alt={`${offer.bean.name}の画像`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full min-h-64 items-center justify-center bg-slate-50 text-sm text-[var(--color-muted)] lg:min-h-96">
          No Image
        </div>
      )}
    </div>
  )
}

function OfferFormField({ children }: { children: ReactNode }) {
  return <div className="mt-3 space-y-2">{children}</div>
}

function OfferDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mx-auto flex w-11/12 border-t border-gray-200 py-2">
      <span className="text-gray-500">{label}</span>
      <span className="ml-auto text-right text-gray-800">{value}</span>
    </div>
  )
}

function OfferBeanProfile({ offer }: { offer: OfferApiResponse }) {
  return (
    <>
      <OfferDetailItem
        label="生産国"
        value={offer.bean.country.name}
      />
      <OfferDetailItem
        label="焙煎度"
        value={offer.bean.roast_level.name}
      />
      <OfferDetailItem
        label="地域"
        value={offer.bean.subregion ?? "未設定"}
      />
      <OfferDetailItem
        label="精製方法"
        value={offer.bean.process ?? "未設定"}
      />
      <OfferDetailItem
        label="フレーバー"
        value={offer.bean.taste.names.join(", ") || "未設定"}
      />
    </>
  )
}

function OfferBeanDetailRows({ offer }: { offer: OfferApiResponse }) {
  return (
    <>
      <OfferDetailItem
        label="生産国"
        value={offer.bean.country.name}
      />
      <OfferDetailItem
        label="焙煎度"
        value={offer.bean.roast_level.name}
      />
      <OfferDetailItem
        label="地域"
        value={offer.bean.subregion ?? "未設定"}
      />
      <OfferDetailItem
        label="農園"
        value={offer.bean.farm ?? "未設定"}
      />
      <OfferDetailItem
        label="品種"
        value={offer.bean.variety ?? "未設定"}
      />
      <OfferDetailItem
        label="精製方法"
        value={offer.bean.process ?? "未設定"}
      />
      <OfferDetailItem
        label="標高"
        value={offer.bean.elevation === null ? "未設定" : `${offer.bean.elevation} m`}
      />
      <OfferDetailItem
        label="収穫時期"
        value={formatCroppedAt(offer.bean.cropped_at)}
      />
    </>
  )
}

function OfferSchedulePanel({ offer }: { offer: OfferApiResponse }) {
  return (
    <>
      <OfferDetailItem
        label="オファー作成日"
        value={formatJaDate(offer.created_at)}
      />
      <OfferDetailItem
        label="オファー終了日"
        value={formatJaDate(offer.ended_at)}
      />
      <OfferDetailItem
        label="焙煎日"
        value={formatJaDate(offer.roasted_at)}
      />
      <OfferDetailItem
        label="受け取り開始日"
        value={formatJaDate(offer.receipt_started_at)}
      />
      <OfferDetailItem
        label="受け取り終了日"
        value={formatJaDate(offer.receipt_ended_at)}
      />
    </>
  )
}

function OfferPricePerWeight({ offer }: { offer: OfferApiResponse }) {
  return (
    <div className="text-2xl text-[var(--color-fg)]">{`${offer.price}円 / ${offer.weight} g`}</div>
  )
}

function WantedUsersStat({ offer, linked = false }: { offer: OfferApiResponse; linked?: boolean }) {
  const content = (
    <span className="text-sm text-[var(--color-fg)]">{`${offer.want.count} wants / ${offer.amount}`}</span>
  )

  if (!linked) {
    return content
  }

  return (
    <Link
      href={`/offers/${offer.id}/wanted_users`}
      className="legacy-text-link"
    >
      {content}
    </Link>
  )
}

function BeanThumbnail({ offer }: { offer: OfferApiResponse }) {
  return (
    <div className="overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
      {offer.bean.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={offer.bean.thumbnail_url}
          alt={`${offer.bean.name}の画像`}
          className="h-28 w-28 object-cover"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center bg-slate-100 text-xs text-[var(--color-muted)]">
          No Image
        </div>
      )}
    </div>
  )
}

function RoasterThumbnail({ offer }: { offer: OfferApiResponse }) {
  return (
    <Link href={`/roasters/${offer.roaster.id}`}>
      <div className="overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
        {offer.roaster.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.roaster.thumbnail_url}
            alt={`${offer.roaster.name}の画像`}
            className="h-24 w-24 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center bg-slate-100 text-xs text-[var(--color-muted)]">
            Roaster
          </div>
        )}
      </div>
    </Link>
  )
}

function UserThumbnail({ user }: { user: UserApiResponse }) {
  return (
    <div className="overflow-hidden rounded-full border border-[var(--color-border)] bg-white shadow-sm">
      {user.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.thumbnail_url}
          alt={`${user.name}の画像`}
          className="h-14 w-14 object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center bg-slate-100 text-xs text-[var(--color-muted)]">
          User
        </div>
      )}
    </div>
  )
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

function formatCroppedAt(value: string | null) {
  if (!value) {
    return "未設定"
  }

  const date = new Date(`${value}T00:00:00`)

  return `${date.getFullYear()}年 ${date.getMonth() + 1}月`
}

function todayKey() {
  const now = new Date()

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
}

function getNumberOfDaysFromTodayTo(value: string) {
  const target = new Date(`${value}T00:00:00`)
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = target.getTime() - start.getTime()

  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
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
  return `w-full rounded-md border bg-white px-4 py-3 text-sm text-gray-600 shadow-sm focus:outline-none ${
    message ? "border-rose-300 bg-rose-50/40" : "border-gray-100"
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
  const messages = [
    ...new Set(Object.values(errors).filter((value): value is string => Boolean(value))),
  ]

  if (submitError) {
    messages.unshift(submitError)
  }

  return [...new Set(messages)]
}
