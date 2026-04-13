import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { requireApiSession } from "@/server/auth/api-guards"
import { getWantsStatsForUser } from "@/server/wants"

export async function GET() {
  try {
    const session = await requireApiSession()
    const stats = await getWantsStatsForUser(session.id)

    return NextResponse.json(stats)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}
