import { OfferStatus } from "@prisma/client"

import { buildBeanApiResponse, type BeanApiResponse } from "@/server/beans"
import { buildUserApiResponse, type UserApiResponse } from "@/server/profiles/dto"

type OfferLikeSummaryInput = {
  id: bigint
}

type OfferWantSummaryInput = {
  id: bigint
}

type OfferRoasterDtoInput = {
  id: bigint
  image: string | null
  name: string
}

type OfferBeanDtoInput = {
  acidity: number | null
  beanImages: Array<{
    image: string | null
  }>
  beanTasteTags: Array<{
    tasteTag: {
      id: bigint
      name: string | null
    }
  }>
  bitterness: number | null
  body: number | null
  country: {
    id: bigint
    name: string | null
  }
  croppedAt: Date | null
  describe: string | null
  elevation: number | null
  farm: string
  flavor: number | null
  id: bigint
  name: string | null
  process: string
  roastLevel: {
    id: bigint
    name: string | null
  }
  roaster: OfferRoasterDtoInput
  roasterId: bigint
  subregion: string
  sweetness: number | null
  variety: string
}

type OfferDtoInput = {
  _count: {
    wants: number
  }
  amount: number
  bean: OfferBeanDtoInput
  beanId: bigint
  createdAt: Date
  endedAt: Date
  id: bigint
  likes: OfferLikeSummaryInput[]
  price: number
  receiptEndedAt: Date
  receiptStartedAt: Date
  roastedAt: Date
  status?: OfferStatus
  wants: OfferWantSummaryInput[]
  weight: number | null
}

export type OfferApiResponse = {
  amount: number
  bean: BeanApiResponse
  bean_id: number
  created_at: string
  ended_at: string
  id: number
  like: {
    id?: number
    is_liked: boolean
  }
  price: number
  receipt_ended_at: string
  receipt_started_at: string
  roasted_at: string
  roaster: {
    id: number
    name: string
    thumbnail_url: string | null
  }
  status: OfferStatus
  want: {
    count: number
    id?: number
    is_wanted: boolean
  }
  weight: number
}

export type OffersStatsApiResponse = {
  end_of_sales: number
  on_offering: number
  on_preparing: number
  on_roasting: number
  on_selling: number
}

export function buildOfferApiResponse(input: OfferDtoInput): OfferApiResponse {
  const viewerWant = input.wants[0]
  const viewerLike = input.likes[0]

  return {
    amount: input.amount,
    bean: buildBeanApiResponse(input.bean),
    bean_id: Number(input.beanId),
    created_at: formatDateOnly(input.createdAt),
    ended_at: formatDateOnly(input.endedAt),
    id: Number(input.id),
    like: viewerLike
      ? {
          id: Number(viewerLike.id),
          is_liked: true,
        }
      : {
          is_liked: false,
        },
    price: input.price,
    receipt_ended_at: formatDateOnly(input.receiptEndedAt),
    receipt_started_at: formatDateOnly(input.receiptStartedAt),
    roasted_at: formatDateOnly(input.roastedAt),
    roaster: {
      id: Number(input.bean.roaster.id),
      name: input.bean.roaster.name.trim() || "ロースター未設定",
      thumbnail_url: input.bean.roaster.image,
    },
    status:
      input.status ??
      calculateOfferStatus({
        endedAt: input.endedAt,
        receiptEndedAt: input.receiptEndedAt,
        receiptStartedAt: input.receiptStartedAt,
        roastedAt: input.roastedAt,
      }),
    want: viewerWant
      ? {
          count: input._count.wants,
          id: Number(viewerWant.id),
          is_wanted: true,
        }
      : {
          count: input._count.wants,
          is_wanted: false,
        },
    weight: input.weight ?? 0,
  }
}

export function buildOfferStatsApiResponse(input: OffersStatsApiResponse): OffersStatsApiResponse {
  return input
}

export function buildWantedUsersApiResponse(users: OfferWantedUserInput[]): UserApiResponse[] {
  return users.map((user) => buildUserApiResponse(user))
}

type OfferWantedUserInput = {
  describe: string | null
  email: string
  guest: boolean
  id: bigint
  image: string | null
  name: string
  prefectureCode: string
  roasterId: bigint | null
}

type OfferStatusSchedule = {
  endedAt: Date
  receiptEndedAt: Date
  receiptStartedAt: Date
  roastedAt: Date
}

export function calculateOfferStatus(
  schedule: OfferStatusSchedule,
  now: Date = new Date(),
): OfferStatus {
  const today = startOfDay(now)

  if (today <= endOfDay(schedule.endedAt)) {
    return OfferStatus.on_offering
  }

  if (today <= endOfDay(schedule.roastedAt)) {
    return OfferStatus.on_roasting
  }

  if (today < startOfDay(schedule.receiptStartedAt)) {
    return OfferStatus.on_preparing
  }

  if (today <= endOfDay(schedule.receiptEndedAt)) {
    return OfferStatus.on_selling
  }

  return OfferStatus.end_of_sales
}

function formatDateOnly(value: Date) {
  return value.toISOString().slice(0, 10)
}

function startOfDay(value: Date) {
  const normalized = new Date(value)

  normalized.setHours(0, 0, 0, 0)

  return normalized
}

function endOfDay(value: Date) {
  const normalized = new Date(value)

  normalized.setHours(23, 59, 59, 999)

  return normalized
}
