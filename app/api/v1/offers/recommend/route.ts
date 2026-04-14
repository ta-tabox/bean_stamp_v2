import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { AppError } from "@/server/errors"
import { listRecommendedOffersForUser } from "@/server/search"

export async function GET() {
  try {
    const session = await requireApiSession()
    const offers = await listRecommendedOffersForUser(session.id)

    return NextResponse.json(offers)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

async function requireApiSession() {
  const session = await getSessionPrincipal()

  if (!session) {
    throw new AppError("Authentication required", {
      code: "UNAUTHORIZED",
      status: 401,
      userMessage: "認証が必要です",
    })
  }

  return session
}
