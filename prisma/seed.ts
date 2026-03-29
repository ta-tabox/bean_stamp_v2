import { PrismaClient } from "@prisma/client"

import {
  countriesSeedData,
  roastLevelsSeedData,
  tasteTagsSeedData,
} from "../src/server/db/seed-data"

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction([
    prisma.roastLevel.createMany({
      data: roastLevelsSeedData.map((roastLevel) => ({
        id: BigInt(roastLevel.id),
        name: roastLevel.name,
      })),
      skipDuplicates: true,
    }),
    prisma.country.createMany({
      data: countriesSeedData.map((country) => ({
        area: country.area,
        id: BigInt(country.id),
        name: country.name,
      })),
      skipDuplicates: true,
    }),
    prisma.tasteTag.createMany({
      data: tasteTagsSeedData.map((tasteTag) => ({
        id: BigInt(tasteTag.id),
        name: tasteTag.name,
        tasteGroupId: BigInt(tasteTag.tasteGroupId),
      })),
      skipDuplicates: true,
    }),
  ])
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
