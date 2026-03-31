import type { ReactNode } from "react"

import { PublicChrome } from "@/components/layout/PublicChrome"

type PublicLayoutProps = Readonly<{
  children: ReactNode
}>

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <PublicChrome>{children}</PublicChrome>
}
