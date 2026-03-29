import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var __beanStampPrisma__: PrismaClient | undefined
}

export type DatabaseConnection = PrismaClient

function createPrismaClient(): PrismaClient {
  return new PrismaClient()
}

export const prisma =
  globalThis.__beanStampPrisma__ ??
  (() => {
    const client = createPrismaClient()

    if (process.env.NODE_ENV !== "production") {
      globalThis.__beanStampPrisma__ = client
    }

    return client
  })()

export function getDatabaseConnection(): DatabaseConnection {
  return prisma
}
