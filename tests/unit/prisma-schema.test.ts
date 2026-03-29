import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")

describe("Prisma schema", () => {
  it("Issue 03 で必要な enum と主要モデルを定義している", () => {
    const schema = readFileSync(schemaPath, "utf8")

    expect(schema).toContain("enum OfferStatus")
    expect(schema).toContain("enum WantRate")
    expect(schema).toContain("model User")
    expect(schema).toContain("model Roaster")
    expect(schema).toContain("model Bean")
    expect(schema).toContain("model Offer")
    expect(schema).toContain("model Want")
    expect(schema).toContain("model Like")
    expect(schema).toContain('@@map("users")')
    expect(schema).toContain('@@map("offers")')
    expect(schema).toContain("@@unique([userId, offerId])")
  })
})
