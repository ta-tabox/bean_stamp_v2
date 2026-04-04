"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

type HomeOfferStatus =
  | "end_of_sales"
  | "on_offering"
  | "on_preparing"
  | "on_roasting"
  | "on_selling"

type HomeOfferCardProps = {
  beanImageUrl: string | null
  beanName: string
  countryName: string
  href: string
  price: number
  process: string
  roastLevelName: string
  roasterHref: string
  roasterImageUrl: string | null
  roasterName: string
  status: HomeOfferStatus
  wantsCount: number
  weight: number
}

type HomeReloadButtonProps = {
  label?: string
}

const offerStatusLabel: Record<HomeOfferStatus, string> = {
  end_of_sales: "販売終了",
  on_offering: "募集中",
  on_preparing: "受け取り準備中",
  on_roasting: "焙煎中",
  on_selling: "販売中",
}

export function HomeOfferCard({
  beanImageUrl,
  beanName,
  countryName,
  href,
  price,
  process,
  roastLevelName,
  roasterHref,
  roasterImageUrl,
  roasterName,
  status,
  wantsCount,
  weight,
}: HomeOfferCardProps) {
  return (
    <article className="page-card overflow-hidden pt-0">
      <div className="flex justify-center -mt-10 lg:justify-end">
        <Link href={roasterHref}>
          <img
            src={roasterImageUrl ?? "/images/default-roaster.png"}
            alt={`${roasterName}の画像`}
            className="h-20 w-20 rounded-full border-2 border-indigo-500 object-cover"
          />
        </Link>
      </div>

      <div className="-mt-2 flex justify-end">
        <Link
          href={roasterHref}
          className="legacy-text-link text-sm"
        >
          {roasterName}
        </Link>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="metric-chip">{offerStatusLabel[status]}</span>
        <span className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-500">
          Wants {wantsCount}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="title-font text-2xl text-gray-800">{beanName}</h2>
            <Link
              href={href}
              className="btn btn-secondary w-20"
            >
              詳細
            </Link>
          </div>

          <dl className="mt-5 grid gap-3 text-sm text-gray-500 sm:grid-cols-3">
            <div className="detail-tile">
              <dt className="text-xs uppercase tracking-[0.24em] text-gray-400">Country</dt>
              <dd className="mt-2 text-base text-gray-700">{countryName}</dd>
            </div>
            <div className="detail-tile">
              <dt className="text-xs uppercase tracking-[0.24em] text-gray-400">Process</dt>
              <dd className="mt-2 text-base text-gray-700">{process}</dd>
            </div>
            <div className="detail-tile">
              <dt className="text-xs uppercase tracking-[0.24em] text-gray-400">Roast</dt>
              <dd className="mt-2 text-base text-gray-700">{roastLevelName}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-end justify-end gap-3 text-gray-700">
            <span className="text-sm text-gray-500">{weight}g</span>
            <span className="title-font text-2xl">¥{price.toLocaleString("ja-JP")}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl lg:w-[20rem]">
          {beanImageUrl ? (
            <img
              src={beanImageUrl}
              alt={`${beanName}の画像`}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export function HomeReloadButton({ label = "更新" }: HomeReloadButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex justify-center">
      <button
        type="button"
        aria-label={label}
        className="inline-flex h-10 w-16 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
        onClick={() => {
          startTransition(() => {
            router.refresh()
          })
        }}
      >
        <svg className={`h-6 w-6 ${isPending ? "animate-spin" : ""}`}>
          <use href="#arrow-path" />
        </svg>
      </button>
    </div>
  )
}
