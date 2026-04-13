import { OfferStatus, Prisma } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/server/db"
import { AppError } from "@/server/errors"
import { buildOfferSelect, calculateOfferStatus } from "@/server/offers"
import { buildLikeApiResponse } from "@/server/likes/dto"

const likeSelect = (viewerUserId: bigint | null) =>
  ({
    id: true,
    offer: {
      select: buildOfferSelect(viewerUserId),
    },
    offerId: true,
    userId: true,
  }) satisfies Prisma.LikeSelect

type LikeRecord = Prisma.LikeGetPayload<{
  select: ReturnType<typeof likeSelect>
}>

export function parseLikeCreateInput(input: Record<string, unknown>) {
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

export async function listLikesForUser(userId: string, statusFilter?: string | null) {
  const parsedUserId = parseId(userId, "ユーザーID")
  const likes = await prisma.like.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: likeSelect(parsedUserId),
    where: {
      userId: parsedUserId,
    },
  })

  const targetStatus = normalizeStatusFilter(statusFilter)

  return likes
    .map(buildLikeRecord)
    .filter((like) => (targetStatus ? like.offer.status === targetStatus : true))
}

export async function createLike(userId: string, offerId: string) {
  const parsedUserId = parseId(userId, "ユーザーID")
  const parsedOfferId = parseId(offerId, "オファーID")

  const offer = await prisma.offer.findUnique({
    select: {
      id: true,
    },
    where: {
      id: parsedOfferId,
    },
  })

  if (!offer) {
    throw createOfferNotFoundError()
  }

  try {
    const like = await prisma.like.create({
      data: {
        offerId: parsedOfferId,
        userId: parsedUserId,
      },
      select: likeSelect(parsedUserId),
    })

    return buildLikeRecord(like)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AppError("Like already exists", {
        code: "VALIDATION_ERROR",
        status: 422,
        userMessage: "すでにお気に入りに追加しています",
      })
    }

    throw error
  }
}

export async function deleteLike(userId: string, likeId: string) {
  const existingLike = await prisma.like.findFirst({
    select: {
      id: true,
      offerId: true,
    },
    where: {
      id: parseId(likeId, "ライクID"),
      userId: parseId(userId, "ユーザーID"),
    },
  })

  if (!existingLike) {
    throw createLikeNotFoundError()
  }

  await prisma.like.delete({
    where: {
      id: existingLike.id,
    },
  })

  return {
    messages: ["お気に入りを削除しました"],
    offerId: existingLike.offerId.toString(),
  }
}

function buildLikeRecord(like: LikeRecord) {
  return buildLikeApiResponse({
    ...like,
    offer: {
      ...like.offer,
      status: calculateOfferStatus(like.offer),
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

function createLikeNotFoundError() {
  return new AppError("Like not found", {
    code: "NOT_FOUND",
    status: 404,
    userMessage: "お気に入りが見つかりません",
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
