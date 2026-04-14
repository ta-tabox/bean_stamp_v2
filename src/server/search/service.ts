import { Prisma } from "@prisma/client"

import { normalizePrefectureCode } from "@/components/shared/prefecture-label"
import { prisma } from "@/server/db"
import { AppError } from "@/server/errors"
import { buildOfferApiResponse, buildOfferSelect, calculateOfferStatus } from "@/server/offers"
import { buildRoasterApiResponse } from "@/server/profiles/dto"

const PAGE_SIZE = 10

const roasterSearchSelect = {
  address: true,
  describe: true,
  guest: true,
  id: true,
  image: true,
  name: true,
  phoneNumber: true,
  prefectureCode: true,
} satisfies Prisma.RoasterSelect

type SearchPagination = {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

type SearchResult<T> = {
  items: T[]
  pagination: SearchPagination
}

type RoasterSearchInput = {
  name?: string | null
  page?: string | null
  prefectureCodes?: string[] | null
}

type OfferSearchInput = {
  countryId?: string | null
  page?: string | null
  prefectureCodes?: string[] | null
  roastLevelId?: string | null
  tasteTagId?: string | null
}

export async function listRoastersBySearch(input: RoasterSearchInput) {
  const currentPage = normalizePage(input.page)
  const where = buildRoasterSearchWhere(input)
  const totalCount = await prisma.roaster.count({ where })
  const roasters = await prisma.roaster.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: roasterSearchSelect,
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    where,
  })

  return {
    items: roasters.map((roaster) => buildRoasterApiResponse(roaster)),
    pagination: buildPagination({ currentPage, totalCount }),
  } satisfies SearchResult<ReturnType<typeof buildRoasterApiResponse>>
}

export async function searchOffers(
  input: OfferSearchInput,
  viewerUserId: string,
  now: Date = new Date(),
) {
  const currentPage = normalizePage(input.page)
  const where = buildOfferSearchWhere(input, now)
  const totalCount = await prisma.offer.count({ where })
  const offers = await prisma.offer.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: buildOfferSelect(parseId(viewerUserId, "ユーザーID")),
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    where,
  })

  return {
    items: offers.map((offer) =>
      buildOfferApiResponse({
        ...offer,
        status: calculateOfferStatus(offer, now),
      }),
    ),
    pagination: buildPagination({ currentPage, totalCount }),
  } satisfies SearchResult<ReturnType<typeof buildOfferApiResponse>>
}

export async function listRecommendedOffersForUser(userId: string, now: Date = new Date()) {
  const parsedUserId = parseId(userId, "ユーザーID")
  const today = startOfDay(now)
  const user = await prisma.user.findUnique({
    select: {
      likes: {
        select: {
          offer: {
            select: {
              bean: {
                select: {
                  beanTasteTags: {
                    select: {
                      tasteTag: {
                        select: {
                          tasteGroupId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      prefectureCode: true,
      roasterId: true,
      wants: {
        select: {
          offer: {
            select: {
              bean: {
                select: {
                  beanTasteTags: {
                    select: {
                      tasteTag: {
                        select: {
                          tasteGroupId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: parsedUserId,
    },
  })

  if (!user) {
    throw new AppError("User not found", {
      code: "NOT_FOUND",
      status: 404,
      userMessage: "ユーザーが存在しません",
    })
  }

  const excludeOwnRoasterId = user.roasterId ?? null
  const tasteGroupIds = collectPreferredTasteGroupIds(user)
  const searchPatterns: Prisma.OfferWhereInput[] = []

  if (tasteGroupIds.length) {
    searchPatterns.push({
      bean: {
        ...(excludeOwnRoasterId ? { roasterId: { not: excludeOwnRoasterId } } : {}),
        beanTasteTags: {
          some: {
            tasteTag: {
              tasteGroupId: {
                in: tasteGroupIds,
              },
            },
          },
        },
      },
      endedAt: {
        gte: today,
      },
    })
  }

  if (user.prefectureCode) {
    searchPatterns.push({
      bean: {
        ...(excludeOwnRoasterId ? { roasterId: { not: excludeOwnRoasterId } } : {}),
        roaster: {
          prefectureCode: user.prefectureCode,
        },
      },
      endedAt: {
        gte: today,
      },
    })
  }

  searchPatterns.push({
    bean: excludeOwnRoasterId ? { roasterId: { not: excludeOwnRoasterId } } : undefined,
    endedAt: {
      gte: today,
    },
  })

  for (const where of searchPatterns) {
    const offers = await prisma.offer.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: buildOfferSelect(parsedUserId),
      take: 10,
      where,
    })

    if (offers.length) {
      return offers.map((offer) =>
        buildOfferApiResponse({
          ...offer,
          status: calculateOfferStatus(offer, now),
        }),
      )
    }
  }

  return []
}

export function buildPaginationHeaders(pagination: SearchPagination) {
  return {
    "current-page": String(pagination.currentPage),
    "page-items": String(pagination.pageSize),
    "total-count": String(pagination.totalCount),
    "total-pages": String(pagination.totalPages),
    "x-current-page": String(pagination.currentPage),
    "x-page-items": String(pagination.pageSize),
    "x-total-count": String(pagination.totalCount),
    "x-total-pages": String(pagination.totalPages),
  }
}

function buildRoasterSearchWhere(input: RoasterSearchInput): Prisma.RoasterWhereInput {
  const where: Prisma.RoasterWhereInput = {}
  const name = input.name?.trim()
  const prefectureCodes = normalizePrefectureCodes(input.prefectureCodes)

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    }
  }

  if (prefectureCodes.length) {
    where.prefectureCode = {
      in: prefectureCodes,
    }
  }

  return where
}

function buildOfferSearchWhere(input: OfferSearchInput, now: Date): Prisma.OfferWhereInput {
  const bean: Prisma.BeanWhereInput = {}
  const prefectureCodes = normalizePrefectureCodes(input.prefectureCodes)

  if (prefectureCodes.length) {
    bean.roaster = {
      prefectureCode: {
        in: prefectureCodes,
      },
    }
  }

  if (input.countryId) {
    bean.countryId = parseId(input.countryId, "生産国")
  }

  if (input.roastLevelId) {
    bean.roastLevelId = parseId(input.roastLevelId, "焙煎度")
  }

  if (input.tasteTagId) {
    bean.beanTasteTags = {
      some: {
        tasteTagId: parseId(input.tasteTagId, "テイストタグ"),
      },
    }
  }

  return {
    bean,
    endedAt: {
      gte: startOfDay(now),
    },
  }
}

function buildPagination({
  currentPage,
  totalCount,
}: {
  currentPage: number
  totalCount: number
}): SearchPagination {
  return {
    currentPage,
    pageSize: PAGE_SIZE,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
  }
}

function collectPreferredTasteGroupIds(user: {
  likes: Array<{
    offer: {
      bean: {
        beanTasteTags: Array<{
          tasteTag: {
            tasteGroupId: bigint
          }
        }>
      }
    }
  }>
  wants: Array<{
    offer: {
      bean: {
        beanTasteTags: Array<{
          tasteTag: {
            tasteGroupId: bigint
          }
        }>
      }
    }
  }>
}) {
  const counts = new Map<bigint, number>()

  for (const relation of [...user.likes, ...user.wants]) {
    for (const tag of relation.offer.bean.beanTasteTags) {
      counts.set(tag.tasteTag.tasteGroupId, (counts.get(tag.tasteTag.tasteGroupId) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([tasteGroupId]) => tasteGroupId)
}

function normalizePage(page?: string | null) {
  const parsed = Number(page)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

function normalizePrefectureCodes(prefectureCodes?: string[] | null) {
  const normalizedCodes: string[] = []

  for (const prefectureCode of prefectureCodes ?? []) {
    const normalizedCode = normalizePrefectureCode(prefectureCode)

    if (normalizedCode) {
      normalizedCodes.push(normalizedCode)
    }
  }

  return normalizedCodes
}

function startOfDay(value: Date) {
  const normalized = new Date(value)

  normalized.setHours(0, 0, 0, 0)

  return normalized
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
