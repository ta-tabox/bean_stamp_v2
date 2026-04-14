import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { AppError } from "@/server/errors"
import { buildPaginationHeaders, listRoastersBySearch } from "@/server/search"

export async function GET(request: Request) {
  try {
    await requireApiSession()
    const url = new URL(request.url)
    const result = await listRoastersBySearch({
      name: url.searchParams.get("name"),
      page: url.searchParams.get("page"),
      prefectureCode: url.searchParams.get("prefecture_code"),
    })

    return NextResponse.json(result.items, {
      headers: buildPaginationHeaders(result.pagination),
    })
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
