import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { buildLegacySessionResponse } from "@/server/auth/session"
import { prisma } from "@/server/db"

export async function GET() {
  const session = await getSessionPrincipal()

  if (!session) {
    return NextResponse.json(buildLegacySessionResponse())
  }

  const roaster = session.roasterId
    ? await prisma.roaster.findUnique({
        where: { id: BigInt(session.roasterId) },
        select: {
          address: true,
          id: true,
          name: true,
          prefectureCode: true,
        },
      })
    : null

  return NextResponse.json(
    buildLegacySessionResponse({
      roaster: roaster
        ? {
            address: roaster.address,
            id: roaster.id.toString(),
            name: roaster.name,
            prefectureCode: roaster.prefectureCode,
          }
        : null,
      user: {
        email: session.email,
        id: session.id,
        name: session.name,
        prefectureCode: session.prefectureCode,
        roasterId: session.roasterId ?? null,
      },
    }),
  )
}
