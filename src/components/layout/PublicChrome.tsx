import type { ReactNode } from "react"

import { SiteHeader } from "@/components/layout/SiteHeader"

type PublicChromeProps = Readonly<{
  children: ReactNode
}>

export function PublicChrome({ children }: PublicChromeProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 pb-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}
