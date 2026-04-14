import { PrismaClient } from "@prisma/client"

import { calculateOfferStatus } from "../src/server/offers"
import { hashPassword } from "../src/server/auth/password"
import {
  buildOfferScheduleFromSeedDate,
  developmentBeans,
  developmentFollows,
  developmentLikes,
  DEVELOPMENT_PASSWORD,
  developmentOffers,
  developmentRoasters,
  developmentUsers,
  developmentWants,
} from "./seed-development-data"
import { seedMasterData } from "./seed"

const prisma = new PrismaClient()

async function main() {
  await seedMasterData(prisma)

  const passwordHash = await hashPassword(DEVELOPMENT_PASSWORD)
  const roasterIdByName = await seedDevelopmentRoasters()

  await seedDevelopmentUsers(passwordHash, roasterIdByName)
  await seedDevelopmentFollows(roasterIdByName)
  const beanIdByName = await seedDevelopmentBeans(roasterIdByName)
  const offerIdByCode = await seedDevelopmentOffers(beanIdByName)
  await seedDevelopmentLikes(offerIdByCode)
  await seedDevelopmentWants(offerIdByCode)

  console.info("[seed:dev] development users")
  for (const user of developmentUsers) {
    console.info(`- ${user.email} / ${DEVELOPMENT_PASSWORD}`)
  }

  console.info("[seed:dev] development offers")
  for (const offer of developmentOffers) {
    console.info(`- ${offer.code}: ${offer.schedulePreset}`)
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
  const offerIdByCode = new Map<string, bigint>()

  for (const offer of developmentOffers) {
    const beanId = beanIdByName.get(offer.beanName)

    if (!beanId) {
      continue
    }

    const { endedAt, receiptEndedAt, receiptStartedAt, roastedAt } = buildOfferScheduleFromSeedDate(
      today,
      offer.schedulePreset,
    )

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
      const savedOffer = await prisma.offer.update({
        where: { id: existingOffer.id },
        data,
        select: { id: true },
      })
      offerIdByCode.set(offer.code, savedOffer.id)
      continue
    }

    const savedOffer = await prisma.offer.create({
      data,
      select: { id: true },
    })
    offerIdByCode.set(offer.code, savedOffer.id)
  }

  return offerIdByCode
}

async function seedDevelopmentLikes(offerIdByCode: Map<string, bigint>) {
  for (const likeSeed of developmentLikes) {
    const user = await prisma.user.findFirst({
      where: { email: likeSeed.userEmail },
      select: { id: true, roasterId: true },
    })
    const offerId = offerIdByCode.get(likeSeed.offerCode)

    if (!user || !offerId) {
      continue
    }

    await prisma.like.upsert({
      where: {
        userId_offerId: {
          offerId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        offerId,
        userId: user.id,
      },
    })
  }
}

async function seedDevelopmentWants(offerIdByCode: Map<string, bigint>) {
  for (const wantSeed of developmentWants) {
    const user = await prisma.user.findFirst({
      where: { email: wantSeed.userEmail },
      select: { id: true, roasterId: true },
    })
    const offerId = offerIdByCode.get(wantSeed.offerCode)

    if (!user || !offerId) {
      continue
    }

    await prisma.want.upsert({
      where: {
        userId_offerId: {
          offerId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        offerId,
        userId: user.id,
      },
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
