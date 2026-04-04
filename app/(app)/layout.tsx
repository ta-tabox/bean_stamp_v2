import type { ReactNode } from "react"
import { headers } from "next/headers"

import { AppChrome } from "@/components/layout/AppChrome"
import { SidebarModeSwitcher } from "@/components/layout/SidebarModeSwitcher"
import { SignOutButton } from "@/features/auth/components/SignOutButton"
import { requireSession } from "@/server/auth/guards"
import { getRoasterProfile, getUserProfile } from "@/server/profiles/service"

type AppLayoutProps = Readonly<{
  children: ReactNode
}>

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: AppLayoutProps) {
  const requestHeaders = await headers()
  const session = await requireSession()
  const currentUserLabel = `ログイン中: ${session.name || session.email}`
  const user = await getUserProfile(session.id)
  const roaster = session.roasterId ? await getRoasterProfile(session.roasterId, session.id) : null
  const currentPath = readCurrentPath(requestHeaders)

  return (
    <AppChrome
      currentUserLabel={currentUserLabel}
      sidebarFooter={
        <>
          <SidebarModeSwitcher
            isRoasterRoute={currentPath.startsWith("/roasters")}
            roasterId={session.roasterId}
            roasterImageUrl={roaster?.thumbnail_url ?? null}
            roasterName={roaster?.name ?? null}
            userImageUrl={user.thumbnail_url}
            userName={user.name}
          />
          <div className="mt-4">
            <SignOutButton />
          </div>
        </>
      }
      topHref={currentPath.startsWith("/roasters") ? "/roasters/home" : "/users/home"}
    >
      {children}
    </AppChrome>
  )
}

function readCurrentPath(requestHeaders: Headers) {
  const nextUrl = requestHeaders.get("next-url")

  if (nextUrl) {
    return nextUrl
  }

  const matchedPath = requestHeaders.get("x-matched-path")

  if (matchedPath) {
    return matchedPath
  }

  return ""
}
