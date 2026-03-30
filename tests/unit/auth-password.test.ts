import { describe, expect, it } from "vitest"

import { hashPassword, verifyPassword } from "@/server/auth/password"

describe("password helpers", () => {
  it("ハッシュ化したパスワードを検証できる", async () => {
    const hashedPassword = await hashPassword("secret123")

    await expect(verifyPassword("secret123", hashedPassword)).resolves.toBe(true)
    await expect(verifyPassword("wrong-password", hashedPassword)).resolves.toBe(false)
  })
})
