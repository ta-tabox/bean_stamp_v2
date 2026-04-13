import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { requireApiSession } from "@/server/auth/api-guards"
import { markWantAsReceived, revalidateWantPaths } from "@/server/wants"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const want = await markWantAsReceived(session.id, id)

    revalidateWantPaths(String(want.offer.id), id)

    return NextResponse.json(want)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}
