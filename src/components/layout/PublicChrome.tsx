import type { ReactNode } from "react"

import { SiteHeader } from "@/components/layout/SiteHeader"

type PublicChromeProps = Readonly<{
  children: ReactNode
}>

export function PublicChrome({ children }: PublicChromeProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader
        action={
          <p className="rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-sm text-[var(--color-ink-soft)]">
            Legacy Layout to Next.js
          </p>
        }
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_28px_80px_rgba(86,52,28,0.1)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)] lg:px-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.4em] text-[var(--color-accent)]">
                COMMON LAYOUT
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
                公開ページの土台を旧 UI に寄せた共通レイアウトへ更新
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
                Header と導線を共通化し、`/`、`/about`、`/help` の到達体験を統一しています。
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 text-sm text-[var(--color-ink-soft)]">
              <div>
                <p className="text-xs font-semibold tracking-[0.28em] text-[var(--color-accent)]">
                  NAVIGATION
                </p>
                <p className="mt-2 leading-6">
                  主要な公開ページと認証ページへ上部導線から遷移できます。
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.28em] text-[var(--color-accent)]">
                  RESPONSIVE
                </p>
                <p className="mt-2 leading-6">
                  モバイルは横スクロールナビ、デスクトップは固定ヘッダーで表示します。
                </p>
              </div>
            </div>
          </div>
        </section>
        {children}
      </div>
    </div>
  )
}
