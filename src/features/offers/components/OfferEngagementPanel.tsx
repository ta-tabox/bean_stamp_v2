"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { HeartIcon, ShoppingBagIcon } from "@/components/icon/Icon"
import { useToast } from "@/components/ui/ToastProvider"

type OfferEngagementPanelProps = {
  amount: number
  beanName: string
  canInteract: boolean
  initialLikeId?: number
  initialWantCount: number
  initialWantId?: number
  offerId: number
  receiptStartedAt: string
  wantActionEnabled: boolean
}

type ApiErrorResponse = {
  error?: {
    message?: string
  }
}

export function OfferEngagementPanel({
  amount,
  beanName,
  canInteract,
  initialLikeId,
  initialWantCount,
  initialWantId,
  offerId,
  receiptStartedAt,
  wantActionEnabled,
}: OfferEngagementPanelProps) {
  const [likeId, setLikeId] = useState<number | null>(initialLikeId ?? null)
  const [wantCount, setWantCount] = useState(initialWantCount)
  const [wantId, setWantId] = useState<number | null>(initialWantId ?? null)
  const [isLikePending, setIsLikePending] = useState(false)
  const [isWantPending, setIsWantPending] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  async function handleWantClick() {
    if (isWantPending || !canInteract || !wantActionEnabled) {
      return
    }

    setIsWantPending(true)

    try {
      if (wantId) {
        const response = await fetch(`/api/v1/wants/${wantId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(await readErrorMessage(response))
        }

        setWantId(null)
        setWantCount((count) => Math.max(0, count - 1))
        showToast(`${beanName}のウォントを取り消しました`, "success")
      } else {
        const response = await fetch("/api/v1/wants", {
          body: JSON.stringify({ offer_id: offerId }),
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        })

        if (!response.ok) {
          throw new Error(await readErrorMessage(response))
        }

        const payload = (await response.json()) as { id: number }

        setWantId(payload.id)
        setWantCount((count) => count + 1)
        showToast(
          `${beanName}をウォントしました。${formatJaDate(receiptStartedAt)}から受け取れます。`,
          "success",
        )
      }

      router.refresh()
    } catch (error) {
      showToast(error instanceof Error ? error.message : "ウォントの更新に失敗しました", "error")
    } finally {
      setIsWantPending(false)
    }
  }

  async function handleLikeClick() {
    if (isLikePending || !canInteract) {
      return
    }

    setIsLikePending(true)

    try {
      if (likeId) {
        const response = await fetch(`/api/v1/likes/${likeId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(await readErrorMessage(response))
        }

        setLikeId(null)
        showToast(`${beanName}をお気に入りから外しました`, "success")
      } else {
        const response = await fetch("/api/v1/likes", {
          body: JSON.stringify({ offer_id: offerId }),
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        })

        if (!response.ok) {
          throw new Error(await readErrorMessage(response))
        }

        const payload = (await response.json()) as { id: number }

        setLikeId(payload.id)
        showToast(`${beanName}をお気に入りに追加しました`, "success")
      }

      router.refresh()
    } catch (error) {
      showToast(error instanceof Error ? error.message : "お気に入りの更新に失敗しました", "error")
    } finally {
      setIsLikePending(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        {canInteract ? (
          <div className="flex gap-3">
            <div className="flex w-14 flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  void handleWantClick()
                }}
                disabled={isWantPending || !wantActionEnabled || (!wantId && wantCount >= amount)}
                aria-pressed={Boolean(wantId)}
                aria-label={wantId ? "ウォント解除" : "ウォント"}
                className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 ${
                  wantId
                    ? "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                } disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-sm disabled:opacity-50 disabled:hover:bg-inherit`}
              >
                <ShoppingBagIcon className="h-7 w-7" />
                <span className="sr-only">{wantId ? "ウォント解除" : "ウォント"}</span>
              </button>
              <span className="w-full text-center text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">
                {wantId ? "Wanted" : "Want"}
              </span>
            </div>
            <div className="flex w-14 flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  void handleLikeClick()
                }}
                disabled={isLikePending}
                aria-pressed={Boolean(likeId)}
                aria-label={likeId ? "お気に入り解除" : "お気に入り"}
                className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 ${
                  likeId
                    ? "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                } disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-sm disabled:opacity-50 disabled:hover:bg-inherit`}
              >
                <HeartIcon
                  className="h-7 w-7"
                  fill={likeId ? "currentColor" : "none"}
                />
                <span className="sr-only">{likeId ? "お気に入り解除" : "お気に入り"}</span>
              </button>
              <span className="w-full text-center text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">
                {likeId ? "Liked" : "Like"}
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="text-right text-sm text-[var(--color-fg)]">{`${wantCount} wants / ${amount}`}</div>
      </div>
    </div>
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
    const payload = (await response.json()) as ApiErrorResponse

    return payload.error?.message ?? "操作に失敗しました"
  } catch {
    return "操作に失敗しました"
  }
}
