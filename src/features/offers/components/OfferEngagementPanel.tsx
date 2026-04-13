"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { HeartIcon, ShoppingBagIcon } from "@/components/icon/Icon"
import { StatusBanner } from "@/components/ui/StatusBanner"

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
  const [message, setMessage] = useState<string | null>(null)
  const [messageTone, setMessageTone] = useState<"error" | "success">("success")
  const [wantCount, setWantCount] = useState(initialWantCount)
  const [wantId, setWantId] = useState<number | null>(initialWantId ?? null)
  const [isLikePending, setIsLikePending] = useState(false)
  const [isWantPending, setIsWantPending] = useState(false)
  const router = useRouter()

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
        setMessage(`${beanName}のウォントを取り消しました`)
        setMessageTone("success")
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
        setMessage(
          `${beanName}をウォントしました。${formatJaDate(receiptStartedAt)}から受け取れます。`,
        )
        setMessageTone("success")
      }

      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ウォントの更新に失敗しました")
      setMessageTone("error")
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
        setMessage(`${beanName}をお気に入りから外しました`)
        setMessageTone("success")
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
        setMessage(`${beanName}をお気に入りに追加しました`)
        setMessageTone("success")
      }

      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "お気に入りの更新に失敗しました")
      setMessageTone("error")
    } finally {
      setIsLikePending(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        {canInteract ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                void handleWantClick()
              }}
              disabled={isWantPending || !wantActionEnabled || (!wantId && wantCount >= amount)}
              aria-pressed={Boolean(wantId)}
              aria-label={wantId ? "ウォント解除" : "ウォント"}
              className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition ${
                wantId
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-600"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <ShoppingBagIcon className="h-7 w-7" />
              <span className="sr-only">{wantId ? "ウォント解除" : "ウォント"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                void handleLikeClick()
              }}
              disabled={isLikePending}
              aria-pressed={Boolean(likeId)}
              aria-label={likeId ? "お気に入り解除" : "お気に入り"}
              className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition ${
                likeId
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-slate-200 bg-white text-slate-600"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <HeartIcon
                className="h-7 w-7"
                fill={likeId ? "currentColor" : "none"}
              />
              <span className="sr-only">{likeId ? "お気に入り解除" : "お気に入り"}</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="text-right text-sm text-[var(--color-fg)]">{`${wantCount} wants / ${amount}`}</div>
      </div>

      {canInteract ? (
        <div className="flex gap-3 text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">
          <span>{wantId ? "Wanted" : "Want"}</span>
          <span>{likeId ? "Liked" : "Like"}</span>
        </div>
      ) : null}

      {message ? (
        <div role="status">
          <StatusBanner>
            <span className={messageTone === "error" ? "text-rose-700" : undefined}>{message}</span>
          </StatusBanner>
        </div>
      ) : null}
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
