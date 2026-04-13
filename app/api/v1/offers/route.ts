import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { createOffer, listOffersForRoaster, parseOfferMutationInput } from "@/server/offers"
import { revalidateOfferPaths } from "@/server/offers/revalidation"
import { AppError } from "@/server/errors"

export async function GET(request: Request) {
  try {
    const session = await requireApiRoasterSession()
    const url = new URL(request.url)
    const offers = await listOffersForRoaster(
      session.roasterId,
      session.id,
      url.searchParams.get("search") ?? url.searchParams.get("status"),
    )

    return NextResponse.json(offers)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function POST(request: Request) {
  const isHtmlFormRequest = isFormNavigationRequest(request)
  let payload: Record<string, unknown> | null = null

  try {
    const session = await requireApiRoasterSession()
    payload = await readOfferPayload(request)
    const offer = await createOffer(session.roasterId, session.id, parseOfferMutationInput(payload))

    revalidateOfferPaths(String(offer.id))

    if (isHtmlFormRequest) {
      return redirectFromRequest(request, `/offers/${offer.id}?created=1`)
    }

    return NextResponse.json(offer)
  } catch (error) {
    if (isHtmlFormRequest) {
      const beanId = String(payload?.beanId ?? "")

      return redirectForFormError(
        request,
        error,
        `/offers/new${beanId ? `?beanId=${encodeURIComponent(beanId)}` : ""}`,
      )
    }

    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

async function requireApiRoasterSession() {
  const session = await getSessionPrincipal()

  if (!session) {
    throw new AppError("Authentication required", {
      code: "UNAUTHORIZED",
      status: 401,
      userMessage: "認証が必要です",
    })
  }

  if (!session.roasterId) {
    throw new AppError("Roaster membership required", {
      code: "FORBIDDEN",
      status: 403,
      userMessage: "ロースター登録が必要です",
    })
  }

  return {
    ...session,
    roasterId: session.roasterId,
  }
}

async function readOfferPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as Record<string, unknown>
    const offerPayload = readRecord(payload.offer)

    return {
      amount: offerPayload.amount ?? payload.amount,
      beanId: offerPayload.beanId ?? offerPayload.bean_id ?? payload.beanId ?? payload.bean_id,
      endedAt: offerPayload.endedAt ?? offerPayload.ended_at ?? payload.endedAt ?? payload.ended_at,
      price: offerPayload.price ?? payload.price,
      receiptEndedAt:
        offerPayload.receiptEndedAt ??
        offerPayload.receipt_ended_at ??
        payload.receiptEndedAt ??
        payload.receipt_ended_at,
      receiptStartedAt:
        offerPayload.receiptStartedAt ??
        offerPayload.receipt_started_at ??
        payload.receiptStartedAt ??
        payload.receipt_started_at,
      roastedAt:
        offerPayload.roastedAt ??
        offerPayload.roasted_at ??
        payload.roastedAt ??
        payload.roasted_at,
      weight: offerPayload.weight ?? payload.weight,
    }
  }

  const formData = await request.formData()

  return {
    amount: formData.get("amount") ?? formData.get("offer[amount]"),
    beanId:
      formData.get("beanId") ?? formData.get("offer[beanId]") ?? formData.get("offer[bean_id]"),
    endedAt:
      formData.get("endedAt") ?? formData.get("offer[endedAt]") ?? formData.get("offer[ended_at]"),
    price: formData.get("price") ?? formData.get("offer[price]"),
    receiptEndedAt:
      formData.get("receiptEndedAt") ??
      formData.get("offer[receiptEndedAt]") ??
      formData.get("offer[receipt_ended_at]"),
    receiptStartedAt:
      formData.get("receiptStartedAt") ??
      formData.get("offer[receiptStartedAt]") ??
      formData.get("offer[receipt_started_at]"),
    roastedAt:
      formData.get("roastedAt") ??
      formData.get("offer[roastedAt]") ??
      formData.get("offer[roasted_at]"),
    weight: formData.get("weight") ?? formData.get("offer[weight]"),
  }
}

function readRecord(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
}

function isFormNavigationRequest(request: Request) {
  const accept = request.headers.get("accept") ?? ""
  const contentType = request.headers.get("content-type") ?? ""

  return accept.includes("text/html") && !contentType.includes("application/json")
}

function redirectForFormError(request: Request, error: unknown, fallbackPath: string) {
  const response = toApiErrorResponse(error)

  if (response.status === 401) {
    return redirectFromRequest(request, "/auth/signin")
  }

  if (response.status === 403) {
    return redirectFromRequest(request, "/users/home")
  }

  const separator = fallbackPath.includes("?") ? "&" : "?"

  return redirectFromRequest(
    request,
    `${fallbackPath}${separator}error=${encodeURIComponent(response.payload.error.message)}`,
  )
}

function redirectFromRequest(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 })
}
