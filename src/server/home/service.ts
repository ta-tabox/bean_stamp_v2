import { OfferStatus, Prisma } from "@prisma/client"

import type { HomeOfferSummary } from "@/features/home/types"
import { prisma } from "@/server/db"

const homeOfferSelect = {
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
        take: 1,
      },
      bitterness: true,
      body: true,
      country: {
        select: {
          name: true,
        },
      },
      beanTasteTags: {
        orderBy: {
          id: "asc",
        },
        select: {
          tasteTag: {
            select: {
              name: true,
            },
          },
        },
      },
      flavor: true,
      name: true,
      process: true,
      roastLevel: {
        select: {
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
      sweetness: true,
    },
  },
  createdAt: true,
  endedAt: true,
  id: true,
  price: true,
  receiptEndedAt: true,
  receiptStartedAt: true,
  roastedAt: true,
  status: true,
  weight: true,
} satisfies Prisma.OfferSelect

type HomeOfferRecord = Prisma.OfferGetPayload<{
  select: typeof homeOfferSelect
}>

export async function listCurrentOffersForUserHome(userId: string) {
  const offers = await prisma.offer.findMany({
    orderBy: [{ roastedAt: "desc" }, { id: "desc" }],
    select: homeOfferSelect,
    take: 10,
    where: {
      bean: {
        roaster: {
          followers: {
            some: {
              followerId: parseId(userId),
            },
          },
        },
      },
      status: {
        not: OfferStatus.end_of_sales,
      },
    },
  })

  return offers.map(buildHomeOfferCard)
}

export async function listCurrentOffersForRoasterHome(roasterId: string) {
  const offers = await prisma.offer.findMany({
    orderBy: [{ roastedAt: "desc" }, { id: "desc" }],
    select: homeOfferSelect,
    take: 10,
    where: {
      bean: {
        roasterId: parseId(roasterId),
      },
    },
  })

  return offers.map(buildHomeOfferCard)
}

export function buildHomeOfferCard(offer: HomeOfferRecord): HomeOfferSummary {
  return {
    acidity: offer.bean.acidity ?? 0,
    amount: offer.amount,
    beanImageUrl: offer.bean.beanImages[0]?.image ?? null,
    beanName: offer.bean.name?.trim() || "名称未設定",
    bitterness: offer.bean.bitterness ?? 0,
    body: offer.bean.body ?? 0,
    countryName: offer.bean.country.name?.trim() || "産地未設定",
    createdAt: formatDateOnly(offer.createdAt),
    endedAt: formatDateOnly(offer.endedAt),
    flavor: offer.bean.flavor ?? 0,
    id: offer.id.toString(),
    price: offer.price,
    process: offer.bean.process.trim() || "精製方法未設定",
    receiptEndedAt: formatDateOnly(offer.receiptEndedAt),
    receiptStartedAt: formatDateOnly(offer.receiptStartedAt),
    roastLevelName: offer.bean.roastLevel.name?.trim() || "焙煎度未設定",
    roastedAt: formatDateOnly(offer.roastedAt),
    roasterId: offer.bean.roaster.id.toString(),
    roasterImageUrl: offer.bean.roaster.image ?? null,
    roasterName: offer.bean.roaster.name.trim() || "ロースター未設定",
    status: offer.status,
    sweetness: offer.bean.sweetness ?? 0,
    tasteNames: offer.bean.beanTasteTags.flatMap((tag) => {
      const name = tag.tasteTag.name?.trim()

      return name ? [name] : []
    }),
    wantsCount: offer._count.wants,
    weight: offer.weight,
  }
}

function parseId(value: string) {
  return BigInt(value)
}

function formatDateOnly(value: Date) {
  return value.toISOString().slice(0, 10)
}
