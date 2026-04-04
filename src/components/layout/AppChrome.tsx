import Link from "next/link"
import type { ReactNode } from "react"

import { AppNavigation } from "@/components/layout/AppNavigation"
import { NotificationPanel } from "@/components/layout/NotificationPanel"

type AppChromeProps = Readonly<{
  children: ReactNode
  currentUserLabel: string
  sidebarFooter: ReactNode
  topHref: string
}>

export function AppChrome({ children, currentUserLabel, sidebarFooter, topHref }: AppChromeProps) {
  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl">
      <div className="flex flex-col lg:flex-row">
        <div className="border-b border-gray-200 bg-gray-100 lg:hidden">
          <div className="px-4 py-3">
            <p className="logo-font text-2xl text-yellow-800">Bean Stamp</p>
            <p className="mt-1 text-sm text-gray-500">{currentUserLabel}</p>
          </div>
          <AppNavigation orientation="horizontal" />
        </div>
        <aside className="hidden w-28 shrink-0 border-r border-gray-200 lg:block">
          <div className="sticky top-0 flex min-h-screen flex-col items-center justify-between">
            <div className="w-full">
              <div className="mx-4 mt-12 pb-8 text-center">
                <Link href={topHref}>
                  <span className="logo-font px-2 text-xl tracking-tight text-teal-900 lg:text-2xl">
                    Bean Stamp
                  </span>
                </Link>
              </div>
              <div className="mx-auto w-12">
                <hr className="border-gray-200" />
              </div>
              <div className="flex justify-center">
                <AppNavigation orientation="vertical" />
              </div>
            </div>

            <div className="mb-8 w-full text-center">
              <div className="mx-auto mb-8 w-12">
                <hr className="border-gray-200" />
              </div>
              <div>{sidebarFooter}</div>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="container mx-auto my-6 px-4 lg:my-14">{children}</div>
        </div>
        <aside className="hidden w-full max-w-xs border-l border-gray-200 bg-gray-100 lg:block">
          <NotificationPanel />
        </aside>
        <div className="border-t border-gray-200 bg-gray-100 p-4 lg:hidden">
          <NotificationPanel compact />
          <div className="mt-4">{sidebarFooter}</div>
        </div>
      </div>
    </div>
  )
}
