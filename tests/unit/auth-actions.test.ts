import crypto from "node:crypto"

import { beforeEach, describe, expect, it, vi } from "vitest"

const { hashPasswordMock, mockPrisma, redirectMock, signInMock, signOutMock } = vi.hoisted(() => ({
  hashPasswordMock: vi.fn(),
  mockPrisma: {
    user: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
  redirectMock: vi.fn((location: string) => {
    throw new RedirectError(location)
  }),
  signInMock: vi.fn(),
  signOutMock: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}))

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

vi.mock("@/server/auth/password", () => ({
  hashPassword: hashPasswordMock,
}))

vi.mock("@/server/auth/options", () => ({
  signIn: signInMock,
  signOut: signOutMock,
}))

vi.mock("@/env", () => ({
  loadServerEnv: vi.fn(() => ({
    NEXTAUTH_URL: "http://localhost:3000",
  })),
}))

import {
  requestPasswordResetAction,
  resetPasswordAction,
  signUpAction,
} from "@/server/auth/actions"

describe("auth/actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hashPasswordMock.mockResolvedValue("hashed-password")
    vi.spyOn(crypto, "randomUUID").mockReturnValue("test-token")
  })

  it("サインアップ成功時はメールアドレスを正規化して作成し signin へリダイレクトする", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue({ id: 1n })

    const formData = new FormData()
    formData.set("email", "USER@example.com")
    formData.set("name", "Test User")
    formData.set("password", "password-123")
    formData.set("passwordConfirmation", "password-123")
    formData.set("prefectureCode", "13")

    await expect(signUpAction(formData)).rejects.toEqual(
      new RedirectError("/auth/signin?registered=1&email=user%40example.com"),
    )

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "user@example.com",
        encryptedPassword: "hashed-password",
        name: "Test User",
        prefectureCode: "13",
        provider: "credentials",
        uid: "user@example.com",
      },
    })
  })

  it("重複メールアドレスでのサインアップは作成せず signup へ戻す", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ id: 1n })

    const formData = new FormData()
    formData.set("email", "user@example.com")
    formData.set("name", "Test User")
    formData.set("password", "password-123")
    formData.set("passwordConfirmation", "password-123")
    formData.set("prefectureCode", "13")

    await expect(signUpAction(formData)).rejects.toEqual(
      new RedirectError(
        "/auth/signup?error=%E3%81%9D%E3%81%AE%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AF%E6%97%A2%E3%81%AB%E4%BD%BF%E7%94%A8%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99",
      ),
    )

    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it("パスワード再設定要求は token を保存して sent=1 へ戻す", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      email: "user@example.com",
      id: 7n,
    })
    mockPrisma.user.update.mockResolvedValue({ id: 7n })

    const formData = new FormData()
    formData.set("email", "user@example.com")

    await expect(requestPasswordResetAction(formData)).rejects.toEqual(
      new RedirectError("/auth/password_reset?sent=1&devToken=test-token"),
    )

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 7n },
      data: {
        resetPasswordSentAt: expect.any(Date),
        resetPasswordToken: "test-token",
      },
    })
  })

  it("無効な再設定トークンではエラー付きで password_reset へ戻す", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null)

    const formData = new FormData()
    formData.set("password", "password-123")
    formData.set("passwordConfirmation", "password-123")
    formData.set("token", "invalid-token")

    await expect(resetPasswordAction(formData)).rejects.toEqual(
      new RedirectError(
        "/auth/password_reset?error=%E5%86%8D%E8%A8%AD%E5%AE%9A%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%81%8C%E7%84%A1%E5%8A%B9%E3%81%A7%E3%81%99",
      ),
    )

    expect(mockPrisma.user.update).not.toHaveBeenCalled()
  })
})

class RedirectError extends Error {
  constructor(readonly location: string) {
    super(`Redirect to ${location}`)
  }
}
