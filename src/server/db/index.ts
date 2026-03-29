export type DatabaseConnection = {
  kind: "prisma"
}

export function getDatabaseConnection(): DatabaseConnection {
  return {
    kind: "prisma",
  }
}
