import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { AppError } from "@/server/errors"
import { buildPaginationHeaders, searchOffers } from "@/server/search"

export async function GET(request: Request) {
  try {
    const session = await requireApiSession()
    const url = new URL(request.url)
    const result = await searchOffers(
      {
        countryId: url.searchParams.get("country_id"),
        page: url.searchParams.get("page"),
        prefectureCodes: url.searchParams.getAll("prefecture_code"),
        roastLevelId: url.searchParams.get("roast_level_id"),
        tasteTagId: url.searchParams.get("taste_tag_id"),
      },
      session.id,
    )

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
