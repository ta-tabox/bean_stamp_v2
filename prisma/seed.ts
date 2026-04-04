import { PrismaClient } from "@prisma/client"

import {
  countriesSeedData,
  roastLevelsSeedData,
  tasteTagsSeedData,
} from "../src/server/db/seed-data"

const prisma = new PrismaClient()

export async function seedMasterData(client: PrismaClient) {
  await client.$transaction([
    client.roastLevel.createMany({
      data: roastLevelsSeedData.map((roastLevel) => ({
        id: BigInt(roastLevel.id),
        name: roastLevel.name,
      })),
      skipDuplicates: true,
    }),
    client.country.createMany({
      data: countriesSeedData.map((country) => ({
        area: country.area,
        id: BigInt(country.id),
        name: country.name,
      })),
      skipDuplicates: true,
    }),
    client.tasteTag.createMany({
      data: tasteTagsSeedData.map((tasteTag) => ({
        id: BigInt(tasteTag.id),
        name: tasteTag.name,
        tasteGroupId: BigInt(tasteTag.tasteGroupId),
      })),
      skipDuplicates: true,
    }),
  ])
}

async function main() {
  await seedMasterData(prisma)
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
