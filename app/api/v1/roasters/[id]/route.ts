import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { AppError } from "@/server/errors"
import {
  deleteRoasterProfile,
  getRoasterProfile,
  parseRoasterProfileInput,
  updateRoasterProfile,
} from "@/server/profiles/service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getSessionPrincipal()
    const { id } = await context.params
    const roaster = await getRoasterProfile(id, session?.id ?? null)

    return NextResponse.json(roaster)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const payload = parseRoasterProfileInput(await readRoasterPayload(request))
    const roaster = await updateRoasterProfile(session.id, id, payload)

    return NextResponse.json(roaster)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const payload = await deleteRoasterProfile(session.id, id)

    return NextResponse.json(payload)
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

async function readRoasterPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>
  }

  const formData = await request.formData()

  return {
    address: formData.get("address"),
    describe: formData.get("describe"),
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber") ?? formData.get("phone_number"),
    prefectureCode: formData.get("prefectureCode") ?? formData.get("prefecture_code"),
  }
}
