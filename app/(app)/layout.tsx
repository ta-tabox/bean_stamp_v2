import type { ReactNode } from "react"

import { AppChrome } from "@/components/layout/AppChrome"
import { SignOutButton } from "@/features/auth/components/SignOutButton"
import { requireSession } from "@/server/auth/guards"
import { getRoasterProfile, getUserProfile } from "@/server/profiles/service"

type AppLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireSession()
  const currentUserLabel = `ログイン中: ${session.name || session.email}`
  const user = await getUserProfile(session.id)
  const roaster = session.roasterId ? await getRoasterProfile(session.roasterId, session.id) : null

  return (
    <AppChrome
      currentUserLabel={currentUserLabel}
      roasterId={session.roasterId}
      roasterImageUrl={roaster?.thumbnail_url ?? null}
      roasterName={roaster?.name ?? null}
      signOutSlot={<SignOutButton />}
      userId={session.id}
      userImageUrl={user.thumbnail_url}
      userName={user.name}
    >
      {children}
    </AppChrome>
  )
}
