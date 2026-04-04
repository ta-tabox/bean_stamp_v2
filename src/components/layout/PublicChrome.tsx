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
          <p className="rounded-full border border-[var(--color-border)] bg-white/75 px-4 py-2 text-sm text-[var(--color-muted)]">
            Legacy Layout to Next.js
          </p>
        }
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="page-card overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
            <div className="space-y-4">
              <p className="panel-label">COMMON LAYOUT</p>
              <h1 className="title-font max-w-3xl text-3xl tracking-tight text-[var(--color-fg)] sm:text-5xl">
                公開ページからアプリ本体まで、同じ UI ルールでつながる土台へ更新
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                Header、タイポグラフィ、カード、ボタンの表現をまとめ、`/`、`/about`、`/help`、
                認証、保護ページの遷移体験を同じ雰囲気でつないでいます。
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="metric-chip">Noto Sans JP</div>
                <div className="metric-chip">Unified Cards</div>
                <div className="metric-chip">Responsive Routes</div>
              </div>
            </div>
            <div className="grid gap-3 rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 text-sm text-[var(--color-muted)]">
              <div>
                <p className="panel-label">NAVIGATION</p>
                <p className="mt-2 leading-6">
                  主要な公開ページと認証ページへ上部導線から遷移できます。
                </p>
              </div>
              <div>
                <p className="panel-label">RESPONSIVE</p>
                <p className="mt-2 leading-6">
                  モバイルは横スクロールナビ、デスクトップは固定ヘッダーで表示します。
                </p>
              </div>
              <div>
                <p className="panel-label">STYLE BASE</p>
                <p className="mt-2 leading-6">
                  後続の Users / Roasters 画面でも同じアクセントカラーとコンテナ表現を使います。
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
