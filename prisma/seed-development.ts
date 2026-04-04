import { PrismaClient } from "@prisma/client"

import { hashPassword } from "../src/server/auth/password"
import { seedMasterData } from "./seed"

const prisma = new PrismaClient()

const DEVELOPMENT_PASSWORD = "password123"

const developmentRoasters = [
  {
    address: "東京都渋谷区神南 1-1-1",
    describe: "フルーティーな浅煎り中心のサンプルロースターです。",
    name: "Light Roast Lab",
    phoneNumber: "03-1111-2222",
    prefectureCode: "13",
  },
  {
    address: "大阪府大阪市北区梅田 2-2-2",
    describe: "深煎りとブレンドを扱うサンプルロースターです。",
    name: "Deep Roast Works",
    phoneNumber: "06-3333-4444",
    prefectureCode: "27",
  },
] as const

const developmentUsers = [
  {
    describe: "ロースター未所属の動作確認用ユーザーです。",
    email: "user1@example.com",
    name: "Sample User 1",
    prefectureCode: "13",
    roasterName: null,
  },
  {
    describe: "Light Roast Lab 所属の動作確認用アカウントです。",
    email: "roaster1@example.com",
    name: "Sample Roaster Owner 1",
    prefectureCode: "13",
    roasterName: "Light Roast Lab",
  },
  {
    describe: "Deep Roast Works 所属の動作確認用アカウントです。",
    email: "roaster2@example.com",
    name: "Sample Roaster Owner 2",
    prefectureCode: "27",
    roasterName: "Deep Roast Works",
  },
  {
    describe: "フォロー導線の確認用ユーザーです。",
    email: "follower@example.com",
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

async function main() {
  await seedMasterData(prisma)

  const passwordHash = await hashPassword(DEVELOPMENT_PASSWORD)
  const roasterIdByName = await seedDevelopmentRoasters()

  await seedDevelopmentUsers(passwordHash, roasterIdByName)
  await seedDevelopmentFollows(roasterIdByName)

  console.info("[seed:dev] development users")
  for (const user of developmentUsers) {
    console.info(`- ${user.email} / ${DEVELOPMENT_PASSWORD}`)
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

main()
  .catch(async (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
