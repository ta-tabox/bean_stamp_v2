"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useId, useState, useTransition } from "react"

import { ArrowPathIcon } from "@/components/icon/Icon"
import type { HomeOfferStatus } from "@/features/home/types"

type HomeOfferCardProps = {
  acidity: number
  amount: number
  beanImageUrl: string | null
  beanName: string
  bitterness: number
  body: number
  countryName: string
  createdAt: string
  endedAt: string
  flavor: number
  href: string
  price: number
  process: string
  receiptEndedAt: string
  receiptStartedAt: string
  roastLevelName: string
  roastedAt: string
  roasterHref: string
  roasterImageUrl: string | null
  roasterName: string
  status: HomeOfferStatus
  sweetness: number
  tasteNames: string[]
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
  acidity,
  amount,
  beanImageUrl,
  beanName,
  bitterness,
  body,
  countryName,
  createdAt,
  endedAt,
  flavor,
  href,
  price,
  process,
  receiptEndedAt,
  receiptStartedAt,
  roastLevelName,
  roastedAt,
  roasterHref,
  roasterImageUrl,
  roasterName,
  status,
  sweetness,
  tasteNames,
  wantsCount,
  weight,
}: HomeOfferCardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "taste" | "schedule">("overview")
  const tabGroupId = useId()

  return (
    <article className="overflow-visible rounded-lg border border-gray-100 bg-white py-2 shadow-md">
      <section>
        <div className="mx-auto mb-2 w-11/12">
          <div className="flex justify-center -mt-16 lg:justify-end">
            <Link href={roasterHref}>
              <img
                src={roasterImageUrl ?? "/images/default-roaster.png"}
                alt={`${roasterName}の画像`}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
            </Link>
          </div>

          <div className="my-1 flex items-start justify-end">
            <div className="ml-auto w-2/3 md:w-1/3">
              <Link
                href={roasterHref}
                className="legacy-text-link text-sm"
              >
                {roasterName}
              </Link>
            </div>
          </div>

          <div className="mt-1 mb-2 flex flex-wrap items-start gap-2">
            <HomeOfferStatusTag status={status} />
            {tasteNames.map((tasteName) => (
              <span
                key={tasteName}
                className="rounded-full border border-gray-200 px-2 py-1 text-xs capitalize text-gray-500"
              >
                {tasteName}
              </span>
            ))}
          </div>

          <div className="md:flex md:items-center">
            <h2 className="title-font text-xl text-gray-800 md:text-2xl">{beanName}</h2>
            <div className="mt-3 text-right md:mt-0 md:ml-4">
              <Link
                href={href}
                className="btn btn-secondary w-20 whitespace-nowrap md:w-16"
              >
                詳細
              </Link>
            </div>
          </div>

          <div className="flex justify-end items-end">
            <div className="mr-4 text-sm text-gray-700">{`${wantsCount} wants / ${amount}`}</div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto mt-4 flex w-11/12 flex-wrap">
          <div className="mb-4 w-full lg:mb-0 lg:w-1/2 lg:pr-4">
            <div
              role="tablist"
              aria-label="Offer content tabs"
              className="home-offer-tab-list"
            >
              <HomeTabButton
                active={activeTab === "overview"}
                controlsId={`${tabGroupId}-overview`}
                label="Overview"
                onClick={() => {
                  setActiveTab("overview")
                }}
              />
              <HomeTabButton
                active={activeTab === "taste"}
                controlsId={`${tabGroupId}-taste`}
                label="Taste"
                onClick={() => {
                  setActiveTab("taste")
                }}
              />
              <HomeTabButton
                active={activeTab === "schedule"}
                controlsId={`${tabGroupId}-schedule`}
                label="Schedule"
                onClick={() => {
                  setActiveTab("schedule")
                }}
              />
            </div>

            <div className="min-h-64 pt-4 lg:h-80">
              {activeTab === "overview" ? (
                <div
                  role="tabpanel"
                  id={`${tabGroupId}-overview`}
                  aria-label="Overview"
                >
                  <dl>
                    <HomeDetailItem
                      label="生産国"
                      value={countryName}
                    />
                    <HomeDetailItem
                      label="精製方法"
                      value={process}
                    />
                    <HomeDetailItem
                      label="焙煎度"
                      value={roastLevelName}
                    />
                  </dl>
                </div>
              ) : null}

              {activeTab === "taste" ? (
                <div
                  role="tabpanel"
                  id={`${tabGroupId}-taste`}
                  aria-label="Taste"
                  className="mx-auto max-w-sm space-y-4"
                >
                  <HomeTasteMetricRow
                    label="酸味"
                    value={acidity}
                  />
                  <HomeTasteMetricRow
                    label="フレーバー"
                    value={flavor}
                  />
                  <HomeTasteMetricRow
                    label="ボディ"
                    value={body}
                  />
                  <HomeTasteMetricRow
                    label="苦味"
                    value={bitterness}
                  />
                  <HomeTasteMetricRow
                    label="甘味"
                    value={sweetness}
                  />
                </div>
              ) : null}

              {activeTab === "schedule" ? (
                <div
                  role="tabpanel"
                  id={`${tabGroupId}-schedule`}
                  aria-label="Schedule"
                >
                  <dl>
                    <HomeDetailItem
                      label="オファー作成日"
                      value={formatJaDate(createdAt)}
                    />
                    <HomeDetailItem
                      label="オファー終了日"
                      value={formatJaDate(endedAt)}
                    />
                    <HomeDetailItem
                      label="焙煎日"
                      value={formatJaDate(roastedAt)}
                    />
                    <HomeDetailItem
                      label="受け取り開始日"
                      value={formatJaDate(receiptStartedAt)}
                    />
                    <HomeDetailItem
                      label="受け取り終了日"
                      value={formatJaDate(receiptEndedAt)}
                    />
                  </dl>
                </div>
              ) : null}
            </div>

            <div className="flex justify-end pt-4">
              <div className="text-2xl text-[var(--color-fg)]">{`${price}円 / ${weight} g`}</div>
            </div>
          </div>

          <div className="mt-auto h-64 w-full overflow-hidden rounded-md border border-gray-100 bg-white md:h-96 lg:w-1/2">
            {beanImageUrl ? (
              <img
                src={beanImageUrl}
                alt={`${beanName}の画像`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}

function HomeTabButton({
  active,
  controlsId,
  label,
  onClick,
}: {
  active: boolean
  controlsId: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controlsId}
      onClick={onClick}
      className={`home-offer-tab ${
        active
          ? "home-offer-tab-selected"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  )
}

function HomeOfferStatusTag({ status }: { status: HomeOfferStatus }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {offerStatusLabel[status]}
    </span>
  )
}

function HomeDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mx-auto flex w-11/12 border-t border-gray-200 py-2">
      <span className="text-gray-500">{label}</span>
      <span className="ml-auto text-right text-gray-800">{value}</span>
    </div>
  )
}

function HomeTasteMetricRow({
  label,
  value,
}: {
  label: string
  value: number
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

function formatJaDate(value: string) {
  const [year, month, date] = value.split("-")

  return `${year}年${Number(month)}月${Number(date)}日`
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
        <ArrowPathIcon className={`h-6 w-6 ${isPending ? "animate-spin" : ""}`} />
      </button>
    </div>
  )
}
