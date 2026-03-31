import type { ReactNode } from "react"

import { AppNavigation } from "@/components/layout/AppNavigation"
import { NotificationPanel } from "@/components/layout/NotificationPanel"
import { SiteHeader } from "@/components/layout/SiteHeader"

type AppChromeProps = Readonly<{
  children: ReactNode
  currentUserLabel: string
  signOutSlot: ReactNode
}>

export function AppChrome({ children, currentUserLabel, signOutSlot }: AppChromeProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader
        showSignInLink={false}
        action={
          <div className="flex items-center gap-3">
            <p className="rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-sm text-[var(--color-ink-soft)]">
              {currentUserLabel}
            </p>
          </div>
        }
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <AppNavigation orientation="horizontal" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4 rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_20px_60px_rgba(86,52,28,0.08)]">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.32em] text-[var(--color-accent)]">
                  APP NAV
                </p>
                <h2 className="text-2xl font-semibold text-[var(--color-fg)]">Main layout</h2>
                <p className="text-sm leading-6 text-[var(--color-ink-soft)]">{currentUserLabel}</p>
              </div>
              <AppNavigation orientation="vertical" />
              <div>{signOutSlot}</div>
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
          <div className="space-y-4">
            <NotificationPanel />
            <div className="lg:hidden">{signOutSlot}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
