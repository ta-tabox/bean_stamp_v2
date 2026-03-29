import Link from "next/link"
import type { ReactNode } from "react"

import { publicRoutes } from "@/features/public"

type PublicLayoutProps = Readonly<{
  children: ReactNode
}>

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 shadow-[0_20px_80px_rgba(82,53,22,0.08)] backdrop-blur">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
                Bean Stamp
              </p>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Next.js アーキテクチャ骨組み
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-soft)] sm:text-base">
                  `app/(public)`・`app/(auth)`・`app/(app)` にルートを分離し、 後続 issue
                  で機能を載せる前提の土台を用意しています。
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              {publicRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-sm font-medium transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
