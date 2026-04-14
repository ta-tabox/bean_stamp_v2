"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { ContentHeader } from "@/components/layout/ContentHeader"
import { StatusBanner } from "@/components/ui/StatusBanner"
import { OfferEngagementPanel } from "@/features/offers/components/OfferEngagementPanel"
import { offerStatusLabel } from "@/features/offers/components/offer-status-label"
import {
  OfferBeanInfoCard,
  OfferDetailSummaryCard,
} from "@/features/offers/components/OffersPageContents"
import type { WantApiResponse } from "@/server/wants"

type WantsListPageContentProps = {
  currentRoasterId?: string | null
  statusFilter?: string
  wants: readonly WantApiResponse[]
}

type WantDetailPageContentProps = {
  canInteract: boolean
  want: WantApiResponse
}

const wantRateLabel: Record<WantApiResponse["rate"], string> = {
  bad: "Bad",
  excellent: "Excellent",
  good: "Good",
  so_so: "So So",
  unrated: "Unrated",
}

const wantRateButtonClasses: Record<Exclude<WantApiResponse["rate"], "unrated">, string> = {
  bad: "border-rose-200 bg-rose-50 text-rose-700",
  excellent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  good: "border-sky-200 bg-sky-50 text-sky-700",
  so_so: "border-amber-200 bg-amber-50 text-amber-700",
}

export function WantsListPageContent({
  currentRoasterId,
  statusFilter,
  wants,
}: WantsListPageContentProps) {
  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">ウォント一覧</h1>
          <form
            action="/wants"
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
                <option value="">有効なウォントを表示</option>
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

      {wants.length ? (
        <section className="space-y-10">
          <ol className="space-y-10">
            {wants.map((want) => (
              <li key={want.id}>
                <WantListItemCard
                  canInteract={currentRoasterId !== String(want.offer.roaster.id)}
                  want={want}
                />
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="page-card text-center text-gray-400">
          <p>ウォントがありません</p>
          <Link
            href="/search/offers"
            className="legacy-text-link mt-2"
          >
            オファーを探す
          </Link>
        </section>
      )}
    </main>
  )
}

export function WantDetailPageContent({ canInteract, want }: WantDetailPageContentProps) {
  const [currentWant, setCurrentWant] = useState(want)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRateOpen, setIsRateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleReceipt() {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/v1/wants/${currentWant.id}/receipt`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error(await readErrorMessage(response))
      }

      const payload = (await response.json()) as WantApiResponse

      setCurrentWant(payload)
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "受け取り処理に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRate(rate: Exclude<WantApiResponse["rate"], "unrated">) {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/v1/wants/${currentWant.id}/rate`, {
        body: JSON.stringify({ rate }),
        headers: {
          "content-type": "application/json",
        },
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error(await readErrorMessage(response))
      }

      const payload = (await response.json()) as WantApiResponse

      setCurrentWant(payload)
      setIsRateOpen(false)
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "評価の登録に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="space-y-6">
      {errorMessage ? <StatusBanner>{errorMessage}</StatusBanner> : null}
      <ContentHeader title="ウォント詳細" />

      <div className="flex justify-end">
        <Link
          href="/wants"
          className="btn btn-secondary"
        >
          一覧へ戻る
        </Link>
      </div>

      <section className="page-card">
        <div className="flex flex-wrap justify-end gap-3">
          {!currentWant.receipted_at ? (
            <button
              type="button"
              onClick={() => {
                void handleReceipt()
              }}
              disabled={isSubmitting || currentWant.offer.status !== "on_selling"}
              className="btn btn-primary"
            >
              コーヒー豆を受け取りました!
            </button>
          ) : currentWant.rate === "unrated" ? (
            <button
              type="button"
              onClick={() => {
                setIsRateOpen(true)
              }}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              コーヒー豆を評価する
            </button>
          ) : (
            <span
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold tracking-[0.18em] uppercase ${wantRateButtonClasses[currentWant.rate]}`}
            >
              {wantRateLabel[currentWant.rate]}
            </span>
          )}
        </div>
      </section>

      <OfferDetailSummaryCard
        canInteract={canInteract}
        offer={currentWant.offer}
      />
      <OfferBeanInfoCard offer={currentWant.offer} />

      {isRateOpen ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="space-y-2">
              <h2 className="title-font text-2xl text-[var(--color-fg)]">コーヒー豆を評価する</h2>
              <p className="text-sm text-[var(--color-muted)]">{currentWant.offer.bean.name}</p>
            </div>
            <div className="mt-6 grid gap-3">
              {(
                Object.keys(wantRateButtonClasses) as Array<
                  Exclude<WantApiResponse["rate"], "unrated">
                >
              ).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    void handleRate(rate)
                  }}
                  disabled={isSubmitting}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold ${wantRateButtonClasses[rate]}`}
                >
                  {wantRateLabel[rate]}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsRateOpen(false)
                }}
                className="btn btn-secondary"
              >
                閉じる
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function WantListItemCard({ canInteract, want }: { canInteract: boolean; want: WantApiResponse }) {
  return (
    <article className="overflow-visible rounded-lg border border-gray-100 bg-white p-6 shadow-md">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
              {want.receipted_at ? "Receipted" : "Waiting"}
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
              {wantRateLabel[want.rate]}
            </span>
          </div>
          <Link
            href={`/wants/${want.id}`}
            className="btn btn-secondary btn-compact"
          >
            ウォント詳細
          </Link>
        </div>

        <OfferEngagementPanel
          amount={want.offer.amount}
          beanName={want.offer.bean.name}
          canInteract={canInteract}
          initialLikeId={want.offer.like.id}
          initialWantCount={want.offer.want.count}
          initialWantId={want.id}
          offerId={want.offer.id}
          receiptStartedAt={want.offer.receipt_started_at}
          wantActionEnabled={want.offer.status === "on_offering"}
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-3">
            <h2 className="title-font text-2xl text-[var(--color-fg)]">{want.offer.bean.name}</h2>
            <p className="text-sm text-[var(--color-muted)]">{want.offer.roaster.name}</p>
            <dl className="grid gap-2 text-sm text-[var(--color-fg)]">
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                <dt>ステータス</dt>
                <dd>{offerStatusLabel[want.offer.status]}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                <dt>受け取り開始日</dt>
                <dd>{formatJaDate(want.offer.receipt_started_at)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                <dt>価格</dt>
                <dd>{`${want.offer.price}円 / ${want.offer.weight} g`}</dd>
              </div>
            </dl>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-slate-50">
            {want.offer.bean.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={want.offer.bean.thumbnail_url}
                alt={`${want.offer.bean.name}の画像`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-56 items-center justify-center text-sm text-[var(--color-muted)]">
                No Image
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function formatJaDate(value: string) {
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${year}年${month}月${day}日`
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { error?: { message?: string } }

    return payload.error?.message ?? "操作に失敗しました"
  } catch {
    return "操作に失敗しました"
  }
}
