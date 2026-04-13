import Link from "next/link"

import {
  buildNotificationItems,
  type NotificationMode,
} from "@/components/layout/notification-items"
import type { OffersStatsApiResponse } from "@/server/offers"
import type { WantsStatsApiResponse } from "@/server/wants"

export function NotificationPanel({
  compact = false,
  mode,
  offersStats,
  wantsStats,
}: {
  compact?: boolean
  mode: NotificationMode
  offersStats?: OffersStatsApiResponse | null
  wantsStats?: WantsStatsApiResponse | null
}) {
  const items = buildNotificationItems({
    mode,
    offersStats,
    wantsStats,
  })

  return (
    <aside className={compact ? "" : "sticky top-0 h-screen overflow-y-auto px-6 py-10"}>
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-serif text-lg italic text-gray-600">Notification</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {mode === "roaster"
              ? "Offers の進行状況を表示します。"
              : "Wants の進行状況を表示します。"}
          </p>
        </div>
        <div className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
              >
                {item.text}
              </Link>
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-600">
              お知らせはありません
            </div>
          )}
        </div>
      </section>
    </aside>
  )
}
