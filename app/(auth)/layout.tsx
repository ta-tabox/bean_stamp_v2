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
        <aside className="page-card">
          <p className="panel-label">AUTH</p>
          <h2 className="title-font mt-3 text-3xl tracking-tight text-[var(--color-fg)]">
            認証ルート
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            旧フロントで公開レイアウト配下にあった認証導線を、同じヘッダー配下へ整理しています。
          </p>
          <div className="mt-6 grid gap-3">
            <div className="detail-tile">
              <p className="panel-label">FLOW</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Sign in / Sign up / Password reset を同じフォームパターンで案内します。
              </p>
            </div>
            <div className="detail-tile">
              <p className="panel-label">TONE</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                公開面と同じ配色を使いながら、操作領域だけ濃いアクセントで視線を集めます。
              </p>
            </div>
          </div>
        </aside>
        <div>{children}</div>
      </section>
    </PublicChrome>
  )
}
