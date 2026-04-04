import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { listRoastersFollowedByUser } from "@/server/profiles/service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const roasters = await listRoastersFollowedByUser(id)

    return NextResponse.json(roasters)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}
