import type { ReactNode } from "react"

import { appRoutes } from "@/features/app"
import { SectionLayout } from "@/components/layout/SectionLayout"
import { SignOutButton } from "@/features/auth/components/SignOutButton"
import { requireSession } from "@/server/auth/guards"

type AppLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireSession()

  return (
    <SectionLayout
      badge="App"
      title="認証後アプリ"
      description={`${session.name || session.email} としてログイン中です。未認証ユーザーはこのレイアウトへ到達できません。`}
      links={appRoutes}
    >
      <div className="mb-4 flex justify-end">
        <SignOutButton />
      </div>
      {children}
    </SectionLayout>
  )
}
