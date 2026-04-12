import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { listWantedUsersForOffer } from "@/server/offers"
import { AppError } from "@/server/errors"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiRoasterSession()
    const { id } = await context.params
    const users = await listWantedUsersForOffer(session.roasterId, id)

    return NextResponse.json(users)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

async function requireApiRoasterSession() {
  const session = await getSessionPrincipal()

  if (!session) {
    throw new AppError("Authentication required", {
      code: "UNAUTHORIZED",
      status: 401,
      userMessage: "認証が必要です",
    })
  }

  if (!session.roasterId) {
    throw new AppError("Roaster membership required", {
      code: "FORBIDDEN",
      status: 403,
      userMessage: "ロースター登録が必要です",
    })
  }

  return {
    ...session,
    roasterId: session.roasterId,
  }
}
