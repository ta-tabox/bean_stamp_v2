import type { ReactNode } from "react"

import { AppNavigation } from "@/components/layout/AppNavigation"
import { NotificationPanel } from "@/components/layout/NotificationPanel"
import { SiteHeader } from "@/components/layout/SiteHeader"

type AppChromeProps = Readonly<{
  children: ReactNode
  currentUserLabel: string
  sidebarFooter: ReactNode
}>

export function AppChrome({ children, currentUserLabel, sidebarFooter }: AppChromeProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader
        showSignInLink={false}
        action={
          <div className="flex items-center gap-3">
            <p className="rounded-full border border-[var(--color-border)] bg-white/75 px-4 py-2 text-sm text-[var(--color-muted)]">
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
            <div className="page-card sticky top-28 space-y-4 p-5">
              <div className="space-y-2">
                <p className="panel-label">APP NAV</p>
                <h2 className="title-font text-2xl text-[var(--color-fg)]">Main layout</h2>
                <p className="text-sm leading-6 text-[var(--color-muted)]">{currentUserLabel}</p>
              </div>
              <AppNavigation orientation="vertical" />
              <div>{sidebarFooter}</div>
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
          <div className="space-y-4">
            <NotificationPanel />
            <div className="lg:hidden">{sidebarFooter}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
