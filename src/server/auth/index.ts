import { redirect } from "next/navigation"

import { auth } from "@/server/auth/options"

export type SessionPrincipal = {
  email: string
  id: string
  name: string
  prefectureCode: string
  roasterId?: string | null
}

export async function getSessionPrincipal(): Promise<SessionPrincipal | null> {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    return null
  }

  return {
    email: session.user.email,
    id: session.user.id,
    name: session.user.name ?? "",
    prefectureCode: session.user.prefectureCode,
    roasterId: session.user.roasterId ?? null,
  }
}

export async function requireSession(redirectTo = "/auth/signin"): Promise<SessionPrincipal> {
  const session = await getSessionPrincipal()

  if (!session) {
    redirect(redirectTo)
  }

  return session
}

export async function requireSignedOut(redirectTo = "/users/home") {
  const session = await getSessionPrincipal()

  if (session) {
    redirect(redirectTo)
  }
}

export async function requireRoasterMembership(redirectTo = "/users/home") {
  const session = await requireSession()

  if (!session.roasterId) {
    redirect(redirectTo)
  }

  return session
}

export async function requireNoRoasterMembership(redirectTo = "/roasters/home") {
  const session = await requireSession()

  if (session.roasterId) {
    redirect(redirectTo)
  }

  return session
}
