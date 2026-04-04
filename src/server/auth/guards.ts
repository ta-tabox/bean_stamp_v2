import { redirect } from "next/navigation"

import { auth } from "@/server/auth/options"
import { prisma } from "@/server/db"

export type SessionPrincipal = {
  email: string
  id: string
  name: string
  prefectureCode: string
  roasterId?: string | null
}

export async function getSessionPrincipal(): Promise<SessionPrincipal | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(session.user.id) },
    select: {
      email: true,
      id: true,
      name: true,
      prefectureCode: true,
      roasterId: true,
    },
  })

  if (!user) {
    return null
  }

  return {
    email: user.email,
    id: user.id.toString(),
    name: user.name,
    prefectureCode: user.prefectureCode,
    roasterId: user.roasterId?.toString() ?? null,
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
