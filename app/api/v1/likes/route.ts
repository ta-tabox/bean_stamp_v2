import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { requireApiSession } from "@/server/auth/api-guards"
import {
  createLike,
  listLikesForUser,
  parseLikeCreateInput,
  revalidateLikePaths,
} from "@/server/likes"

export async function GET(request: Request) {
  try {
    const session = await requireApiSession()
    const search = new URL(request.url).searchParams.get("search")
    const likes = await listLikesForUser(session.id, search)

    return NextResponse.json(likes)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    const payload = parseLikeCreateInput(await readPayload(request))
    const like = await createLike(session.id, payload.offerId)

    revalidateLikePaths(String(like.offer.id))

    return NextResponse.json(like, { status: 201 })
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>
  }

  const formData = await request.formData()

  return {
    offerId: formData.get("offerId"),
    offer_id: formData.get("offer_id"),
  }
}
