import { Prisma } from "@prisma/client"

export const buildOfferSelect = (viewerUserId: bigint | null) =>
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

export type OfferRecord = Prisma.OfferGetPayload<{
  select: ReturnType<typeof buildOfferSelect>
}>
