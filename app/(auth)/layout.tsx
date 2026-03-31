import type { ReactNode } from "react"

import { authRoutes } from "@/features/auth"
import { SectionLayout } from "@/components/layout/SectionLayout"
import { requireSignedOut } from "@/server/auth/guards"

type AuthLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AuthLayout({ children }: AuthLayoutProps) {
  await requireSignedOut()

  return (
    <SectionLayout
      badge="Auth"
      title="認証ルート"
      description="サインイン前ユーザー向けのルートです。認証済みの場合はアプリ本体へリダイレクトします。"
      links={authRoutes}
    >
      {children}
    </SectionLayout>
  )
}
