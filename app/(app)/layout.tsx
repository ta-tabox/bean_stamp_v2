import type { ReactNode } from "react"

import { AppChrome } from "@/components/layout/AppChrome"
import { SignOutButton } from "@/features/auth/components/SignOutButton"
import { requireSession } from "@/server/auth/guards"

type AppLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireSession()
  const currentUserLabel = `ログイン中: ${session.name || session.email}`

  return (
    <AppChrome
      currentUserLabel={currentUserLabel}
      signOutSlot={<SignOutButton />}
    >
      {children}
    </AppChrome>
  )
}
