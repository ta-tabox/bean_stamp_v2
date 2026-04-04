import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { AppError } from "@/server/errors"
import {
  deleteUserProfile,
  parseUserProfileInput,
  updateUserProfile,
} from "@/server/profiles/service"

export async function PATCH(request: Request) {
  try {
    const session = await requireApiSession()
    const payload = parseUserProfileInput(await readProfilePayload(request))
    const user = await updateUserProfile(session.id, payload)

    return NextResponse.json(user)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function DELETE() {
  try {
    const session = await requireApiSession()
    const payload = await deleteUserProfile(session.id)

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

async function readProfilePayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>
  }

  const formData = await request.formData()

  return {
    describe: formData.get("describe"),
    email: formData.get("email"),
    name: formData.get("name"),
    prefectureCode: formData.get("prefectureCode") ?? formData.get("prefecture_code"),
  }
}
