import { NextResponse } from "next/server"

import { toApiErrorResponse } from "@/server/api/error-response"
import { requireApiSession } from "@/server/auth/api-guards"
import { parseWantRateInput, rateWant, revalidateWantPaths } from "@/server/wants"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const payload = parseWantRateInput(await readPayload(request))
    const want = await rateWant(session.id, id, payload.rate)

    revalidateWantPaths(String(want.offer.id), id)

    return NextResponse.json(want)
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
    rate: formData.get("rate"),
  }
}
