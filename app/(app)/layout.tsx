import type { ReactNode } from "react"

import { AppChrome } from "@/components/layout/AppChrome"
import { SignOutButton } from "@/features/auth/components/SignOutButton"
import { requireSession } from "@/server/auth/guards"
import { getOfferStatsForRoaster } from "@/server/offers"
import { getRoasterProfile, getUserProfile } from "@/server/profiles/service"
import { getWantsStatsForUser } from "@/server/wants"

type AppLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireSession()
  const currentUserLabel = `ログイン中: ${session.name || session.email}`
  const [user, roaster, wantNotifications, offerNotifications] = await Promise.all([
    getUserProfile(session.id),
    session.roasterId ? getRoasterProfile(session.roasterId, session.id) : Promise.resolve(null),
    getWantsStatsForUser(session.id),
    session.roasterId ? getOfferStatsForRoaster(session.roasterId) : Promise.resolve(null),
  ])

  return (
    <AppChrome
      currentUserLabel={currentUserLabel}
      offerNotifications={offerNotifications}
      roasterId={session.roasterId}
      roasterImageUrl={roaster?.thumbnail_url ?? null}
      roasterName={roaster?.name ?? null}
      signOutSlot={<SignOutButton />}
      userId={session.id}
      userImageUrl={user.thumbnail_url}
      userName={user.name}
      wantNotifications={wantNotifications}
    >
      {children}
    </AppChrome>
  )
}
