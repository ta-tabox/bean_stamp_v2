import { OfferStatus, Prisma } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/server/db"
import { AppError } from "@/server/errors"
import {
  buildOfferApiResponse,
  buildOfferStatsApiResponse,
  buildWantedUsersApiResponse,
  calculateOfferStatus,
} from "@/server/offers/dto"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const offerMutationSchema = z
  .object({
    amount: z.number().int().min(1, "数量を入力してください").max(9999),
    beanId: z.number().int().min(1, "コーヒー豆を選択してください"),
    endedAt: z.string().regex(DATE_PATTERN, "オファー終了日を確認してください"),
    price: z.number().int().min(1, "価格を入力してください").max(999999),
    receiptEndedAt: z.string().regex(DATE_PATTERN, "受け取り終了日を確認してください"),
    receiptStartedAt: z.string().regex(DATE_PATTERN, "受け取り開始日を確認してください"),
    roastedAt: z.string().regex(DATE_PATTERN, "焙煎日を確認してください"),
    weight: z.number().int().min(1, "内容量を入力してください").max(100000),
  })
  .superRefine((input, context) => {
    const today = currentDateKey()

    if (input.endedAt < today) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "オファー終了日は本日以降の日付を指定してください",
        path: ["endedAt"],
      })
    }

    if (input.roastedAt <= input.endedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "焙煎日はオファー終了日より後の日付を指定してください",
        path: ["roastedAt"],
      })
    }

    if (input.receiptStartedAt <= input.roastedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "受け取り開始日は焙煎日より後の日付を指定してください",
        path: ["receiptStartedAt"],
      })
    }

    if (input.receiptEndedAt <= input.receiptStartedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "受け取り終了日は受け取り開始日より後の日付を指定してください",
        path: ["receiptEndedAt"],
      })
    }
  })

export type OfferMutationInput = z.infer<typeof offerMutationSchema>

const offerSelect = (viewerUserId: bigint | null) =>
  ({
    _count: {
      select: {
        wants: true,
      },
    },
    amount: true,
    bean: {
      select: {
        acidity: true,
        beanImages: {
          orderBy: {
            id: "asc",
          },
          select: {
            image: true,
          },
        },
        beanTasteTags: {
          orderBy: {
            id: "asc",
          },
          select: {
            tasteTag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        bitterness: true,
        body: true,
        country: {
          select: {
            id: true,
            name: true,
          },
        },
        croppedAt: true,
        describe: true,
        elevation: true,
        farm: true,
        flavor: true,
        id: true,
        name: true,
        process: true,
        roastLevel: {
          select: {
            id: true,
            name: true,
          },
        },
        roaster: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        roasterId: true,
        subregion: true,
        sweetness: true,
        variety: true,
      },
    },
    beanId: true,
    createdAt: true,
    endedAt: true,
    id: true,
    likes: {
      select: {
        id: true,
      },
      take: 1,
      where: {
        userId: viewerUserId ?? BigInt(0),
      },
    },
    price: true,
    receiptEndedAt: true,
    receiptStartedAt: true,
    roastedAt: true,
    status: true,
    wants: {
      select: {
        id: true,
      },
      take: 1,
      where: {
        userId: viewerUserId ?? BigInt(0),
      },
    },
    weight: true,
  }) satisfies Prisma.OfferSelect

type OfferRecord = Prisma.OfferGetPayload<{
  select: ReturnType<typeof offerSelect>
}>

export function parseOfferMutationInput(input: Record<string, unknown>): OfferMutationInput {
  const parsed = offerMutationSchema.safeParse({
    amount: readRequiredInteger(input.amount),
    beanId: readRequiredInteger(input.beanId),
    endedAt: readRequiredDate(input.endedAt),
    price: readRequiredInteger(input.price),
    receiptEndedAt: readRequiredDate(input.receiptEndedAt),
    receiptStartedAt: readRequiredDate(input.receiptStartedAt),
    roastedAt: readRequiredDate(input.roastedAt),
    weight: readRequiredInteger(input.weight),
  })

  if (!parsed.success) {
    throw new AppError("Invalid offer input", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: parsed.error.issues[0]?.message ?? "入力内容を確認してください",
    })
  }

  return parsed.data
}

export async function listWritableBeansForRoaster(roasterId: string) {
  const beans = await prisma.bean.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      name: true,
    },
    where: {
      roasterId: parseId(roasterId, "ロースターID"),
    },
  })

  return beans.map((bean) => ({
    id: Number(bean.id),
    name: bean.name?.trim() || `Bean #${bean.id.toString()}`,
  }))
}

export async function listOffersForRoaster(
  roasterId: string,
  viewerUserId: string,
  statusFilter?: string | null,
) {
  const offers = await prisma.offer.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: offerSelect(parseOptionalId(viewerUserId)),
    where: {
      bean: {
        roasterId: parseId(roasterId, "ロースターID"),
      },
    },
  })

  return filterOffersByStatus(offers.map(buildOfferRecord), normalizeStatusFilter(statusFilter))
}

export async function getOfferForViewer(offerId: string, viewerUserId: string) {
  const offer = await prisma.offer.findUnique({
    select: offerSelect(parseOptionalId(viewerUserId)),
    where: {
      id: parseId(offerId, "オファーID"),
    },
  })

  if (!offer) {
    throw createOfferNotFoundError()
  }

  return buildOfferRecord(offer)
}

export async function createOffer(roasterId: string, viewerUserId: string, input: OfferMutationInput) {
  await ensureBeanOwnership(roasterId, input.beanId)

  const offer = await prisma.offer.create({
    data: {
      amount: input.amount,
      beanId: BigInt(input.beanId),
      endedAt: toDateValue(input.endedAt),
      price: input.price,
      receiptEndedAt: toDateValue(input.receiptEndedAt),
      receiptStartedAt: toDateValue(input.receiptStartedAt),
      roastedAt: toDateValue(input.roastedAt),
      status: calculateOfferStatus(buildOfferSchedule(input)),
      weight: input.weight,
    },
    select: offerSelect(parseOptionalId(viewerUserId)),
  })

  return buildOfferRecord(offer)
}

export async function updateOffer(
  roasterId: string,
  offerId: string,
  viewerUserId: string,
  input: OfferMutationInput,
) {
  await ensureBeanOwnership(roasterId, input.beanId)
  await ensureOfferOwnership(roasterId, offerId)

  const offer = await prisma.offer.update({
    data: {
      amount: input.amount,
      beanId: BigInt(input.beanId),
      endedAt: toDateValue(input.endedAt),
      price: input.price,
      receiptEndedAt: toDateValue(input.receiptEndedAt),
      receiptStartedAt: toDateValue(input.receiptStartedAt),
      roastedAt: toDateValue(input.roastedAt),
      status: calculateOfferStatus(buildOfferSchedule(input)),
      weight: input.weight,
    },
    select: offerSelect(parseOptionalId(viewerUserId)),
    where: {
      id: parseId(offerId, "オファーID"),
    },
  })

  return buildOfferRecord(offer)
}

export async function deleteOffer(roasterId: string, offerId: string) {
  const existingOffer = await prisma.offer.findFirst({
    select: {
      _count: {
        select: {
          wants: true,
        },
      },
      id: true,
    },
    where: {
      bean: {
        roasterId: parseId(roasterId, "ロースターID"),
      },
      id: parseId(offerId, "オファーID"),
    },
  })

  if (!existingOffer) {
    throw createOfferNotFoundError()
  }

  if (existingOffer._count.wants > 0) {
    throw new AppError("Offer has wants", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: "オファーはウォントされています",
    })
  }

  await prisma.offer.delete({
    where: {
      id: existingOffer.id,
    },
  })

  return {
    messages: ["オファーを削除しました"],
  }
}

export async function listWantedUsersForOffer(roasterId: string, offerId: string) {
  await ensureOfferOwnership(roasterId, offerId)

  const wants = await prisma.want.findMany({
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      user: {
        select: {
          describe: true,
          email: true,
          guest: true,
          id: true,
          image: true,
          name: true,
          prefectureCode: true,
          roasterId: true,
        },
      },
    },
    where: {
      offerId: parseId(offerId, "オファーID"),
    },
  })

  return buildWantedUsersApiResponse(wants.map((want) => want.user))
}

export async function getOfferStatsForRoaster(roasterId: string) {
  const offers = await prisma.offer.findMany({
    select: {
      endedAt: true,
      receiptEndedAt: true,
      receiptStartedAt: true,
      roastedAt: true,
    },
    where: {
      bean: {
        roasterId: parseId(roasterId, "ロースターID"),
      },
    },
  })

  const stats = offers.reduce(
    (accumulator, offer) => {
      const status = calculateOfferStatus(offer)

      accumulator[status] += 1

      return accumulator
    },
    {
      end_of_sales: 0,
      on_offering: 0,
      on_preparing: 0,
      on_roasting: 0,
      on_selling: 0,
    },
  )

  return buildOfferStatsApiResponse(stats)
}

function buildOfferRecord(offer: OfferRecord) {
  return buildOfferApiResponse({
    ...offer,
    status: calculateOfferStatus(offer),
  })
}

function filterOffersByStatus(offers: ReturnType<typeof buildOfferRecord>[], status?: OfferStatus) {
  if (status) {
    return offers.filter((offer) => offer.status === status)
  }

  return offers.filter((offer) => offer.status !== OfferStatus.end_of_sales)
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

async function ensureBeanOwnership(roasterId: string, beanId: number) {
  const bean = await prisma.bean.findFirst({
    select: {
      id: true,
    },
    where: {
      id: BigInt(beanId),
      roasterId: parseId(roasterId, "ロースターID"),
    },
  })

  if (!bean) {
    throw new AppError("Bean not found for roaster", {
      code: "NOT_FOUND",
      status: 404,
      userMessage: "コーヒー豆を登録してください",
    })
  }
}

async function ensureOfferOwnership(roasterId: string, offerId: string) {
  const offer = await prisma.offer.findFirst({
    select: {
      id: true,
    },
    where: {
      bean: {
        roasterId: parseId(roasterId, "ロースターID"),
      },
      id: parseId(offerId, "オファーID"),
    },
  })

  if (!offer) {
    throw createOfferNotFoundError()
  }
}

function createOfferNotFoundError() {
  return new AppError("Offer not found", {
    code: "NOT_FOUND",
    status: 404,
    userMessage: "オファーを登録してください",
  })
}

function buildOfferSchedule(input: OfferMutationInput) {
  return {
    endedAt: toDateValue(input.endedAt),
    receiptEndedAt: toDateValue(input.receiptEndedAt),
    receiptStartedAt: toDateValue(input.receiptStartedAt),
    roastedAt: toDateValue(input.roastedAt),
  }
}

function readRequiredInteger(value: unknown) {
  const normalized = typeof value === "number" ? value : Number(value)

  return Number.isInteger(normalized) ? normalized : NaN
}

function readRequiredDate(value: unknown) {
  if (typeof value === "string") {
    return value.trim()
  }

  return ""
}

function currentDateKey(now = new Date()) {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
}

function toDateValue(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
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

function parseOptionalId(value: string | null) {
  if (!value) {
    return null
  }

  return parseId(value, "ユーザーID")
}
