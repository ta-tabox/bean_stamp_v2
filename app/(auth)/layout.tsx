import type { ReactNode } from "react"

import { PublicChrome } from "@/components/layout/PublicChrome"
import { requireSignedOut } from "@/server/auth/guards"

type AuthLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AuthLayout({ children }: AuthLayoutProps) {
  await requireSignedOut()

  return (
    <PublicChrome>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-[0_20px_50px_rgba(86,52,28,0.08)]">
          <p className="text-xs font-semibold tracking-[0.34em] text-[var(--color-accent)]">AUTH</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
            認証ルート
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            旧フロントで公開レイアウト配下にあった認証導線を、同じヘッダー配下へ整理しています。
          </p>
        </aside>
        <div>{children}</div>
      </section>
    </PublicChrome>
  )
}
