import type { ReactNode } from "react"

import { authRoutes } from "@/features/auth"
import { SectionLayout } from "@/components/layout/section-layout"

type AuthLayoutProps = Readonly<{
  children: ReactNode
}>

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SectionLayout
      badge="Auth"
      title="認証ルート"
      description="将来的には `RequireSignedOutRoute` 相当の判定をレイアウトで行い、サインイン済みユーザーをアプリ本体へリダイレクトします。"
      links={authRoutes}
    >
      {children}
    </SectionLayout>
  )
}
