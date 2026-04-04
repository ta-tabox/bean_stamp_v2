import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { AppError } from "@/server/errors"
import { followRoaster, getRoasterRelationshipStatus } from "@/server/profiles/service"

export async function GET(request: Request) {
  try {
    const session = await requireApiSession()
    const roasterId = new URL(request.url).searchParams.get("roaster_id")

    if (!roasterId) {
      throw new AppError("Missing roaster id", {
        code: "VALIDATION_ERROR",
        status: 422,
        userMessage: "roaster_id を指定してください",
      })
    }

    const status = await getRoasterRelationshipStatus(session.id, roasterId)

    return NextResponse.json(status)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    const roasterId = await readRoasterId(request)
    const payload = await followRoaster(session.id, roasterId)

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

async function readRoasterId(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as { roasterId?: string; roaster_id?: string }

    return payload.roasterId ?? payload.roaster_id ?? ""
  }

  const formData = await request.formData()

  return String(formData.get("roasterId") ?? formData.get("roaster_id") ?? "")
}
