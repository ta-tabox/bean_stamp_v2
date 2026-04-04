import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppError } from "@/server/errors"

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
    roaster: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    roasterRelationship: {
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      delete: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

import {
  createRoasterProfile,
  deleteUserProfile,
  followRoaster,
  parseRoasterProfileInput,
  parseUserProfileInput,
  unfollowRoaster,
  updateRoasterProfile,
} from "@/server/profiles/service"

describe("profiles/service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.$transaction.mockImplementation(async (input: unknown) => {
      if (typeof input === "function") {
        return input(mockPrisma)
      }

      if (Array.isArray(input)) {
        return Promise.all(input)
      }

      return input
    })
  })

  it("ユーザープロフィール入力を正規化して返す", () => {
    expect(
      parseUserProfileInput({
        describe: "  自己紹介  ",
        email: "user@example.com",
        name: "  Test User  ",
        prefectureCode: " 13 ",
      }),
    ).toEqual({
      describe: "自己紹介",
      email: "user@example.com",
      name: "Test User",
      prefectureCode: "13",
    })
  })

  it("不正なユーザープロフィール入力は AppError を送出する", () => {
    expect(() =>
      parseUserProfileInput({
        describe: "",
        email: "invalid-email",
        name: "User",
        prefectureCode: "13",
      }),
    ).toThrowError(AppError)
  })

  it("不正なロースター入力は AppError を送出する", () => {
    expect(() =>
      parseRoasterProfileInput({
        address: "",
        describe: "",
        name: "Roaster",
        phoneNumber: "03-0000-0000",
        prefectureCode: "13",
      }),
    ).toThrowError(AppError)
  })

  it("既に所属ロースターがあるユーザーはロースターを作成できない", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      roasterId: 99n,
    })

    await expect(
      createRoasterProfile("1", {
        address: "Tokyo",
        describe: "desc",
        name: "Roaster",
        phoneNumber: "03-0000-0000",
        prefectureCode: "13",
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      userMessage: "既にロースターに所属しています",
    })
  })

  it("所属していないロースターは更新できない", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      roasterId: 2n,
    })
    mockPrisma.roaster.findUnique.mockResolvedValue({
      id: 3n,
    })

    await expect(
      updateRoasterProfile("1", "3", {
        address: "Tokyo",
        describe: "desc",
        name: "Roaster",
        phoneNumber: "03-0000-0000",
        prefectureCode: "13",
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      userMessage: "所属していないロースターの更新・削除はできません",
    })
  })

  it("所属ロースターはフォローできない", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1n,
      name: "User",
      roasterId: 5n,
    })
    mockPrisma.roaster.findUnique.mockResolvedValue({
      id: 5n,
      name: "Roaster",
    })

    await expect(followRoaster("1", "5")).rejects.toMatchObject({
      code: "FORBIDDEN",
      userMessage: "所属ロースターはフォローできません",
    })
  })

  it("存在しないフォロー関係は解除できない", async () => {
    mockPrisma.roasterRelationship.findUnique.mockResolvedValue(null)

    await expect(unfollowRoaster("1", "10")).rejects.toMatchObject({
      code: "NOT_FOUND",
      userMessage: "フォローが存在しません",
    })
  })

  it("ゲストユーザーは削除できない", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      guest: true,
      id: 1n,
      roasterId: null,
    })

    await expect(deleteUserProfile("1")).rejects.toMatchObject({
      code: "FORBIDDEN",
      userMessage: "ゲストユーザーの変更はできません",
    })
  })

  it("ロースター所属中のユーザーは削除できない", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      guest: false,
      id: 1n,
      roasterId: 7n,
    })

    await expect(deleteUserProfile("1")).rejects.toMatchObject({
      code: "FORBIDDEN",
      userMessage: "所属ロースターがあるため先にロースターを削除してください",
    })
  })
})
