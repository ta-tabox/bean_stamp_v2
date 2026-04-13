"use client"

import Link from "next/link"

import { OfferEngagementPanel } from "@/features/offers/components/OfferEngagementPanel"
import type { LikeApiResponse } from "@/server/likes"

type LikesPageContentProps = {
  currentRoasterId?: string | null
  likes: readonly LikeApiResponse[]
  statusFilter?: string
}

export function LikesPageContent({ currentRoasterId, likes, statusFilter }: LikesPageContentProps) {
  return (
    <main className="space-y-6">
      <section className="content-header-panel">
        <div className="flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="title-font text-3xl text-[var(--color-fg)]">お気に入り一覧</h1>
          <form
            action="/likes"
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
                <option value="">すべて表示</option>
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

      {likes.length ? (
        <section className="space-y-10">
          <ol className="space-y-10">
            {likes.map((like) => (
              <li key={like.id}>
                <article className="overflow-visible rounded-lg border border-gray-100 bg-white p-6 shadow-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-[var(--color-muted)]">
                        {like.offer.roaster.name}
                      </div>
                      <Link
                        href={`/offers/${like.offer.id}`}
                        className="btn btn-secondary btn-compact"
                      >
                        詳細
                      </Link>
                    </div>

                    <OfferEngagementPanel
                      amount={like.offer.amount}
                      beanName={like.offer.bean.name}
                      canInteract={currentRoasterId !== String(like.offer.roaster.id)}
                      initialLikeId={like.id}
                      initialWantCount={like.offer.want.count}
                      initialWantId={like.offer.want.id}
                      offerId={like.offer.id}
                      receiptStartedAt={like.offer.receipt_started_at}
                      wantActionEnabled={like.offer.status === "on_offering"}
                    />

                    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                      <div className="space-y-3">
                        <h2 className="title-font text-2xl text-[var(--color-fg)]">
                          {like.offer.bean.name}
                        </h2>
                        <dl className="grid gap-2 text-sm text-[var(--color-fg)]">
                          <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                            <dt>ステータス</dt>
                            <dd>{like.offer.status}</dd>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                            <dt>受け取り開始日</dt>
                            <dd>{formatJaDate(like.offer.receipt_started_at)}</dd>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                            <dt>価格</dt>
                            <dd>{`${like.offer.price}円 / ${like.offer.weight} g`}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-gray-100 bg-slate-50">
                        {like.offer.bean.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={like.offer.bean.thumbnail_url}
                            alt={`${like.offer.bean.name}の画像`}
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
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="page-card text-center text-gray-400">
          <p>お気に入りがありません</p>
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

function formatJaDate(value: string) {
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${year}年${month}月${day}日`
}
