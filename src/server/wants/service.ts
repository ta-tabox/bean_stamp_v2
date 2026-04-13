import { OfferStatus, Prisma, WantRate } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/server/db"
import { AppError } from "@/server/errors"
import { buildOfferSelect, calculateOfferStatus } from "@/server/offers"
import {
  buildEmptyWantsStats,
  buildWantApiResponse,
  buildWantsStatsApiResponse,
  isActiveWantStatus,
} from "@/server/wants/dto"

const wantRateSchema = z.nativeEnum(WantRate)

const wantSelect = (viewerUserId: bigint | null) =>
  ({
    id: true,
    offer: {
      select: buildOfferSelect(viewerUserId),
    },
    offerId: true,
    rate: true,
    receiptedAt: true,
    userId: true,
  }) satisfies Prisma.WantSelect

type WantRecord = Prisma.WantGetPayload<{
  select: ReturnType<typeof wantSelect>
}>

export function parseWantCreateInput(input: Record<string, unknown>) {
  const offerId = readIdentifier(input.offerId ?? input.offer_id)

  if (!offerId) {
    throw new AppError("Offer id is required", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "オファーを確認してください",
    })
  }

  return {
    offerId,
  }
}

export function parseWantRateInput(input: Record<string, unknown>) {
  const parsed = wantRateSchema.safeParse(readRequiredString(input.rate))

  if (!parsed.success) {
    throw new AppError("Invalid want rate", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "評価を確認してください",
    })
  }

  return {
    rate: parsed.data,
  }
}

export async function listWantsForUser(userId: string, statusFilter?: string | null) {
  const parsedUserId = parseId(userId, "ユーザーID")
  const wants = await prisma.want.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: wantSelect(parsedUserId),
    where: {
      userId: parsedUserId,
    },
  })

  const targetStatus = normalizeStatusFilter(statusFilter)

  return wants.map(buildWantRecord).filter((want) => {
    if (targetStatus) {
      return want.offer.status === targetStatus
    }

    return isActiveWantStatus(want.offer.status)
  })
}

export async function getWantForUser(userId: string, wantId: string) {
  const want = await prisma.want.findFirst({
    select: wantSelect(parseId(userId, "ユーザーID")),
    where: {
      id: parseId(wantId, "ウォントID"),
      userId: parseId(userId, "ユーザーID"),
    },
  })

  if (!want) {
    throw createWantNotFoundError()
  }

  return buildWantRecord(want)
}

export async function createWant(userId: string, offerId: string) {
  const parsedUserId = parseId(userId, "ユーザーID")
  const parsedOfferId = parseId(offerId, "オファーID")

  const offer = await prisma.offer.findUnique({
    select: {
      _count: {
        select: {
          wants: true,
        },
      },
      amount: true,
      endedAt: true,
      id: true,
      receiptEndedAt: true,
      receiptStartedAt: true,
      roastedAt: true,
    },
    where: {
      id: parsedOfferId,
    },
  })

  if (!offer) {
    throw createOfferNotFoundError()
  }

  if (
    calculateOfferStatus({
      endedAt: offer.endedAt,
      receiptEndedAt: offer.receiptEndedAt,
      receiptStartedAt: offer.receiptStartedAt,
      roastedAt: offer.roastedAt,
    }) !== OfferStatus.on_offering
  ) {
    throw new AppError("Offer has ended", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "オファーは終了しました",
    })
  }

  if (offer._count.wants >= offer.amount) {
    throw new AppError("Offer reached max amount", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "数量が上限に達しています",
    })
  }

  try {
    const want = await prisma.want.create({
      data: {
        offerId: parsedOfferId,
        userId: parsedUserId,
      },
      select: wantSelect(parsedUserId),
    })

    return buildWantRecord(want)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AppError("Want already exists", {
        code: "VALIDATION_ERROR",
        status: 422,
        userMessage: "すでにウォントしています",
      })
    }

    throw error
  }
}

export async function deleteWant(userId: string, wantId: string) {
  const existingWant = await prisma.want.findFirst({
    select: {
      id: true,
      offerId: true,
    },
    where: {
      id: parseId(wantId, "ウォントID"),
      userId: parseId(userId, "ユーザーID"),
    },
  })

  if (!existingWant) {
    throw createWantNotFoundError()
  }

  await prisma.want.delete({
    where: {
      id: existingWant.id,
    },
  })

  return {
    messages: ["ウォントを削除しました"],
    offerId: existingWant.offerId.toString(),
  }
}

export async function markWantAsReceived(userId: string, wantId: string) {
  const existingWant = await prisma.want.findFirst({
    select: {
      id: true,
      receiptedAt: true,
    },
    where: {
      id: parseId(wantId, "ウォントID"),
      userId: parseId(userId, "ユーザーID"),
    },
  })

  if (!existingWant) {
    throw createWantNotFoundError()
  }

  if (existingWant.receiptedAt) {
    throw new AppError("Want already received", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "すでに受け取りが完了しています",
    })
  }

  const want = await prisma.want.update({
    data: {
      receiptedAt: new Date(),
    },
    select: wantSelect(parseId(userId, "ユーザーID")),
    where: {
      id: existingWant.id,
    },
  })

  return buildWantRecord(want)
}

export async function rateWant(userId: string, wantId: string, rate: WantRate) {
  const existingWant = await prisma.want.findFirst({
    select: {
      id: true,
      rate: true,
    },
    where: {
      id: parseId(wantId, "ウォントID"),
      userId: parseId(userId, "ユーザーID"),
    },
  })

  if (!existingWant) {
    throw createWantNotFoundError()
  }

  if (existingWant.rate !== WantRate.unrated) {
    throw new AppError("Want already rated", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "すでに評価が完了しています",
    })
  }

  const want = await prisma.want.update({
    data: {
      rate,
    },
    select: wantSelect(parseId(userId, "ユーザーID")),
    where: {
      id: existingWant.id,
    },
  })

  return buildWantRecord(want)
}

export async function getWantsStatsForUser(userId: string) {
  const wants = await prisma.want.findMany({
    select: {
      offer: {
        select: {
          endedAt: true,
          receiptEndedAt: true,
          receiptStartedAt: true,
          roastedAt: true,
        },
      },
      receiptedAt: true,
    },
    where: {
      userId: parseId(userId, "ユーザーID"),
    },
  })

  const stats = wants.reduce((accumulator, want) => {
    const status = calculateOfferStatus(want.offer)

    accumulator[status] += 1

    if (status === OfferStatus.on_selling && !want.receiptedAt) {
      accumulator.not_receipted += 1
    }

    return accumulator
  }, buildEmptyWantsStats())

  return buildWantsStatsApiResponse(stats)
}

function buildWantRecord(want: WantRecord) {
  return buildWantApiResponse({
    ...want,
    offer: {
      ...want.offer,
      status: calculateOfferStatus(want.offer),
    },
  })
}

function normalizeStatusFilter(statusFilter?: string | null) {
  if (!statusFilter) {
    return undefined
  }

  const parsed = z.nativeEnum(OfferStatus).safeParse(statusFilter)

  if (!parsed.success) {
    throw new AppError("Invalid offer status filter", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "ステータスを確認してください",
    })
  }

  return parsed.data
}

function createWantNotFoundError() {
  return new AppError("Want not found", {
    code: "NOT_FOUND",
    status: 404,
    userMessage: "ウォントが見つかりません",
  })
}

function createOfferNotFoundError() {
  return new AppError("Offer not found", {
    code: "NOT_FOUND",
    status: 404,
    userMessage: "オファーが見つかりません",
  })
}

function parseId(value: string, label: string) {
  try {
    return BigInt(value)
  } catch {
    throw new AppError("Invalid id", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: `${label}を確認してください`,
    })
  }
}

function readRequiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function readIdentifier(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return String(value)
  }

  return readRequiredString(value)
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}
