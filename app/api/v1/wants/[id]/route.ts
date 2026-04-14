import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { requireApiSession } from "@/server/auth/api-guards"
import { deleteWant, getWantForUser, revalidateWantPaths } from "@/server/wants"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const want = await getWantForUser(session.id, id)

    return NextResponse.json(want)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const payload = await deleteWant(session.id, id)

    revalidateWantPaths(payload.offerId, id)

    return NextResponse.json({
      messages: payload.messages,
    })
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}
