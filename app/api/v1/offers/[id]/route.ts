import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import {
  deleteOffer,
  getOfferForViewer,
  parseOfferMutationInput,
  updateOffer,
} from "@/server/offers"
import { revalidateOfferPaths } from "@/server/offers/revalidation"
import { AppError } from "@/server/errors"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiSession()
    const { id } = await context.params
    const offer = await getOfferForViewer(id, session.id)

    return NextResponse.json(offer)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireApiRoasterSession()
    const { id } = await context.params
    const offer = await updateOffer(
      session.roasterId,
      id,
      session.id,
      parseOfferMutationInput(await readOfferPayload(request)),
    )

    revalidateOfferPaths(id)

    return NextResponse.json(offer)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function POST(request: Request, context: RouteContext) {
  let intent = "update"

  try {
    const session = await requireApiRoasterSession()
    const { id } = await context.params
    const formData = await request.formData()
    intent = String(formData.get("_intent") ?? "update")

    if (intent === "delete") {
      await deleteOffer(session.roasterId, id)
      revalidateOfferPaths(id)

      return redirectFromRequest(request, "/offers?deleted=1")
    }

    await updateOffer(
      session.roasterId,
      id,
      session.id,
      parseOfferMutationInput({
        amount: formData.get("amount"),
        beanId: formData.get("beanId"),
        endedAt: formData.get("endedAt"),
        price: formData.get("price"),
        receiptEndedAt: formData.get("receiptEndedAt"),
        receiptStartedAt: formData.get("receiptStartedAt"),
        roastedAt: formData.get("roastedAt"),
        weight: formData.get("weight"),
      }),
    )
    revalidateOfferPaths(id)

    return redirectFromRequest(request, `/offers/${id}?updated=1`)
  } catch (error) {
    const { id } = await context.params

    const response = toApiErrorResponse(error)

    if (response.status === 401) {
      return redirectFromRequest(request, "/auth/signin")
    }

    if (response.status === 403) {
      return redirectFromRequest(request, "/users/home")
    }

    const fallbackPath = intent === "delete" ? `/offers/${id}` : `/offers/${id}/edit`

    return redirectFromRequest(
      request,
      `${fallbackPath}?error=${encodeURIComponent(response.payload.error.message)}`,
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireApiRoasterSession()
    const { id } = await context.params
    const payload = await deleteOffer(session.roasterId, id)

    revalidateOfferPaths(id)

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

async function requireApiRoasterSession() {
  const session = await requireApiSession()

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
        offerPayload.roastedAt ?? offerPayload.roasted_at ?? payload.roastedAt ?? payload.roasted_at,
      weight: offerPayload.weight ?? payload.weight,
    }
  }

  const formData = await request.formData()

  return {
    amount: formData.get("amount") ?? formData.get("offer[amount]"),
    beanId: formData.get("beanId") ?? formData.get("offer[beanId]") ?? formData.get("offer[bean_id]"),
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

function redirectFromRequest(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 })
}
