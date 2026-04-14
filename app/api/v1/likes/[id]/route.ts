import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { requireApiSession } from "@/server/auth/api-guards"
import { deleteLike, revalidateLikePaths } from "@/server/likes"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const payload = await deleteLike(session.id, id)

    revalidateLikePaths(payload.offerId)

    return NextResponse.json({
      messages: payload.messages,
    })
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}
