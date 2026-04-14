import { PrismaClient } from "@prisma/client"

import { calculateOfferStatus } from "../src/server/offers"
import { hashPassword } from "../src/server/auth/password"
import { seedMasterData } from "./seed"

const prisma = new PrismaClient()

const DEVELOPMENT_PASSWORD = "password123"

const developmentRoasters = [
  {
    address: "東京都渋谷区神南 1-1-1",
    describe: "フルーティーな浅煎り中心のサンプルロースターです。",
    image: "https://picsum.photos/seed/dev-roaster-light/512/512",
    name: "Light Roast Lab",
    phoneNumber: "03-1111-2222",
    prefectureCode: "13",
  },
  {
    address: "大阪府大阪市北区梅田 2-2-2",
    describe: "深煎りとブレンドを扱うサンプルロースターです。",
    image: "https://picsum.photos/seed/dev-roaster-deep/512/512",
    name: "Deep Roast Works",
    phoneNumber: "06-3333-4444",
    prefectureCode: "27",
  },
] as const

const developmentUsers = [
  {
    describe: "ロースター未所属の動作確認用ユーザーです。",
    email: "user1@example.com",
    image: "https://picsum.photos/seed/dev-user-1/512/512",
    name: "Sample User 1",
    prefectureCode: "13",
    roasterName: null,
  },
  {
    describe: "Light Roast Lab 所属の動作確認用アカウントです。",
    email: "roaster1@example.com",
    image: "https://picsum.photos/seed/dev-user-roaster-1/512/512",
    name: "Sample Roaster Owner 1",
    prefectureCode: "13",
    roasterName: "Light Roast Lab",
  },
  {
    describe: "Deep Roast Works 所属の動作確認用アカウントです。",
    email: "roaster2@example.com",
    image: "https://picsum.photos/seed/dev-user-roaster-2/512/512",
    name: "Sample Roaster Owner 2",
    prefectureCode: "27",
    roasterName: "Deep Roast Works",
  },
  {
    describe: "フォロー導線の確認用ユーザーです。",
    email: "follower@example.com",
    image: "https://picsum.photos/seed/dev-user-follower/512/512",
    name: "Sample Follower",
    prefectureCode: "14",
    roasterName: null,
  },
] as const

const developmentFollows = [
  {
    followerEmail: "user1@example.com",
    roasterName: "Light Roast Lab",
  },
  {
    followerEmail: "user1@example.com",
    roasterName: "Deep Roast Works",
  },
  {
    followerEmail: "follower@example.com",
    roasterName: "Light Roast Lab",
  },
] as const

const developmentBeans = [
  {
    acidity: 4,
    bitterness: 2,
    body: 3,
    countryId: 44,
    describe: "みかんのような明るい酸と華やかさが出るサンプル豆です。",
    elevation: 1450,
    farm: "Okumino Farm",
    flavor: 4,
    image: "https://picsum.photos/seed/dev-bean-light/1200/900",
    name: "Shibuya Morning Blend",
    prefectureCode: "13",
    process: "Washed",
    roastLevelId: 2,
    roasterName: "Light Roast Lab",
    subregion: "Tokyo",
    sweetness: 4,
    tasteTagIds: [5, 24],
    variety: "Geisha",
  },
  {
    acidity: 2,
    bitterness: 4,
    body: 4,
    countryId: 3,
    describe: "チョコレート感の強い深煎りブレンドのサンプル豆です。",
    elevation: 1250,
    farm: "Medellin Estate",
    flavor: 3,
    image: "https://picsum.photos/seed/dev-bean-deep/1200/900",
    name: "Umeda Night Blend",
    prefectureCode: "27",
    process: "Natural",
    roastLevelId: 5,
    roasterName: "Deep Roast Works",
    subregion: "Antioquia",
    sweetness: 3,
    tasteTagIds: [61, 66],
    variety: "Caturra",
  },
] as const

const developmentOffers = [
  {
    amount: 8,
    beanName: "Shibuya Morning Blend",
    endedOffsetDays: 2,
    name: "Shibuya Morning Blend 100g",
    price: 1850,
    receiptEndedOffsetDays: 6,
    receiptStartedOffsetDays: 5,
    roastedOffsetDays: 3,
    weight: 100,
  },
  {
    amount: 12,
    beanName: "Umeda Night Blend",
    endedOffsetDays: 1,
    name: "Umeda Night Blend 200g",
    price: 2100,
    receiptEndedOffsetDays: 5,
    receiptStartedOffsetDays: 4,
    roastedOffsetDays: 2,
    weight: 200,
  },
] as const

async function main() {
  await seedMasterData(prisma)

  const passwordHash = await hashPassword(DEVELOPMENT_PASSWORD)
  const roasterIdByName = await seedDevelopmentRoasters()

  await seedDevelopmentUsers(passwordHash, roasterIdByName)
  await seedDevelopmentFollows(roasterIdByName)
  const beanIdByName = await seedDevelopmentBeans(roasterIdByName)
  await seedDevelopmentOffers(beanIdByName)

  console.info("[seed:dev] development users")
  for (const user of developmentUsers) {
    console.info(`- ${user.email} / ${DEVELOPMENT_PASSWORD}`)
  }

  console.info("[seed:dev] development offers")
  for (const offer of developmentOffers) {
    console.info(`- ${offer.name}`)
  }
}

async function seedDevelopmentRoasters() {
  const roasterIdByName = new Map<string, bigint>()

  for (const roaster of developmentRoasters) {
    const existingRoaster = await prisma.roaster.findFirst({
      where: { name: roaster.name },
      select: { id: true },
    })

    const savedRoaster = existingRoaster
      ? await prisma.roaster.update({
          where: { id: existingRoaster.id },
          data: {
            address: roaster.address,
            describe: roaster.describe,
            image: roaster.image,
            name: roaster.name,
            phoneNumber: roaster.phoneNumber,
            prefectureCode: roaster.prefectureCode,
          },
          select: { id: true },
        })
      : await prisma.roaster.create({
          data: {
            address: roaster.address,
            describe: roaster.describe,
            image: roaster.image,
            name: roaster.name,
            phoneNumber: roaster.phoneNumber,
            prefectureCode: roaster.prefectureCode,
          },
          select: { id: true },
        })

    roasterIdByName.set(roaster.name, savedRoaster.id)
  }

  return roasterIdByName
}

async function seedDevelopmentUsers(passwordHash: string, roasterIdByName: Map<string, bigint>) {
  for (const user of developmentUsers) {
    const roasterId =
      user.roasterName === null ? null : (roasterIdByName.get(user.roasterName) ?? null)
    const existingUser = await prisma.user.findFirst({
      where: { email: user.email },
      select: { id: true },
    })

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          describe: user.describe,
          email: user.email,
          encryptedPassword: passwordHash,
          image: user.image,
          name: user.name,
          prefectureCode: user.prefectureCode,
          provider: "credentials",
          roasterId,
          uid: user.email,
        },
      })
      continue
    }

    await prisma.user.create({
      data: {
        describe: user.describe,
        email: user.email,
        encryptedPassword: passwordHash,
        image: user.image,
        name: user.name,
        prefectureCode: user.prefectureCode,
        provider: "credentials",
        roasterId,
        uid: user.email,
      },
    })
  }
}

async function seedDevelopmentFollows(roasterIdByName: Map<string, bigint>) {
  for (const follow of developmentFollows) {
    const follower = await prisma.user.findFirst({
      where: { email: follow.followerEmail },
      select: { id: true },
    })
    const roasterId = roasterIdByName.get(follow.roasterName)

    if (!follower || !roasterId) {
      continue
    }

    await prisma.roasterRelationship.upsert({
      where: {
        followerId_roasterId: {
          followerId: follower.id,
          roasterId,
        },
      },
      update: {},
      create: {
        followerId: follower.id,
        roasterId,
      },
    })
  }
}

async function seedDevelopmentBeans(roasterIdByName: Map<string, bigint>) {
  const beanIdByName = new Map<string, bigint>()

  for (const bean of developmentBeans) {
    const roasterId = roasterIdByName.get(bean.roasterName)

    if (!roasterId) {
      continue
    }

    const existingBean = await prisma.bean.findFirst({
      where: {
        name: bean.name,
        roasterId,
      },
      select: { id: true },
    })

    const savedBean = existingBean
      ? await prisma.bean.update({
          where: { id: existingBean.id },
          data: buildBeanUpdateMutation(bean, roasterId),
          select: { id: true },
        })
      : await prisma.bean.create({
          data: buildBeanCreateMutation(bean, roasterId),
          select: { id: true },
        })

    beanIdByName.set(bean.name, savedBean.id)
  }

  return beanIdByName
}

async function seedDevelopmentOffers(beanIdByName: Map<string, bigint>) {
  const today = startOfUtcDay(new Date())

  for (const offer of developmentOffers) {
    const beanId = beanIdByName.get(offer.beanName)

    if (!beanId) {
      continue
    }

    const endedAt = addDays(today, offer.endedOffsetDays)
    const roastedAt = addDays(today, offer.roastedOffsetDays)
    const receiptStartedAt = addDays(today, offer.receiptStartedOffsetDays)
    const receiptEndedAt = addDays(today, offer.receiptEndedOffsetDays)

    const existingOffer = await prisma.offer.findFirst({
      where: {
        amount: offer.amount,
        beanId,
        price: offer.price,
        weight: offer.weight,
      },
      select: { id: true },
    })

    const data = {
      amount: offer.amount,
      beanId,
      endedAt,
      price: offer.price,
      receiptEndedAt,
      receiptStartedAt,
      roastedAt,
      status: calculateOfferStatus({
        endedAt,
        receiptEndedAt,
        receiptStartedAt,
        roastedAt,
      }),
      weight: offer.weight,
    }

    if (existingOffer) {
      await prisma.offer.update({
        where: { id: existingOffer.id },
        data,
      })
      continue
    }

    await prisma.offer.create({
      data,
    })
  }
}

function buildBeanCreateMutation(bean: (typeof developmentBeans)[number], roasterId: bigint) {
  return {
    acidity: bean.acidity,
    beanImages: {
      create: [
        {
          image: bean.image,
        },
      ],
    },
    beanTasteTags: {
      create: bean.tasteTagIds.map((tasteTagId) => ({
        tasteTagId: BigInt(tasteTagId),
      })),
    },
    bitterness: bean.bitterness,
    body: bean.body,
    countryId: BigInt(bean.countryId),
    describe: bean.describe,
    elevation: bean.elevation,
    farm: bean.farm,
    flavor: bean.flavor,
    name: bean.name,
    process: bean.process,
    roastLevelId: BigInt(bean.roastLevelId),
    roasterId,
    subregion: bean.subregion,
    sweetness: bean.sweetness,
    variety: bean.variety,
  }
}

function buildBeanUpdateMutation(bean: (typeof developmentBeans)[number], roasterId: bigint) {
  return {
    ...buildBeanCreateMutation(bean, roasterId),
    beanImages: {
      deleteMany: {},
      create: [
        {
          image: bean.image,
        },
      ],
    },
    beanTasteTags: {
      deleteMany: {},
      create: bean.tasteTagIds.map((tasteTagId) => ({
        tasteTagId: BigInt(tasteTagId),
      })),
    },
  }
}

function addDays(base: Date, days: number) {
  const value = new Date(base)

  value.setUTCDate(value.getUTCDate() + days)

  return value
}

function startOfUtcDay(value: Date) {
  const normalized = new Date(value)

  normalized.setUTCHours(0, 0, 0, 0)

  return normalized
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
