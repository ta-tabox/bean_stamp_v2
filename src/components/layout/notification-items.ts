import type { OffersStatsApiResponse } from "@/server/offers"
import type { WantsStatsApiResponse } from "@/server/wants"

export type NotificationMode = "roaster" | "user"

export type NotificationItem = {
  href: string
  text: string
}

export function buildNotificationItems({
  mode,
  offersStats,
  wantsStats,
}: {
  mode: NotificationMode
  offersStats?: OffersStatsApiResponse | null
  wantsStats?: WantsStatsApiResponse | null
}): NotificationItem[] {
  if (mode === "roaster") {
    if (!offersStats) {
      return []
    }

    return [
      offersStats.on_roasting
        ? {
            href: "/offers?status=on_roasting",
            text: `ロースト期間のオファーが${offersStats.on_roasting}件あります`,
          }
        : null,
      offersStats.on_selling
        ? {
            href: "/offers?status=on_selling",
            text: `受け取り期間のオファーが${offersStats.on_selling}件あります`,
          }
        : null,
    ].filter((item): item is NotificationItem => Boolean(item))
  }

  if (!wantsStats) {
    return []
  }

  return [
    wantsStats.on_roasting
      ? {
          href: "/wants?status=on_roasting",
          text: `ロースト期間のウォントが${wantsStats.on_roasting}件あります`,
        }
      : null,
    wantsStats.not_receipted
      ? {
          href: "/wants?status=on_selling",
          text: `未受け取りのウォントが${wantsStats.not_receipted}件あります`,
        }
      : null,
  ].filter((item): item is NotificationItem => Boolean(item))
}
