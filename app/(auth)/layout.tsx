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
      <div className="mx-auto max-w-xl py-8">{children}</div>
    </PublicChrome>
  )
}
