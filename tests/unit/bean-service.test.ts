import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppError } from "@/server/errors"

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    $transaction: vi.fn(),
    bean: {
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
    beanImage: {
      deleteMany: vi.fn(),
    },
    beanTasteTag: {
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock("@/server/db", () => ({
  prisma: mockPrisma,
}))

import { deleteBean, parseBeanMutationInput } from "@/server/beans"

describe("beans/service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.$transaction.mockImplementation(async (input: unknown) => {
      if (typeof input === "function") {
        return input(mockPrisma)
      }

      return input
    })
  })

  it("フレーバータグが 2 件未満だと AppError を送出する", () => {
    expect(() =>
      parseBeanMutationInput({
        countryId: "44",
        name: "Bean",
        roastLevelId: "2",
        tasteTagIds: ["1"],
      }),
    ).toThrowError(AppError)
  })

  it("画像が 4 枚を超えると AppError を送出する", () => {
    const images = Array.from(
      { length: 5 },
      (_, index) => new File([`image-${index}`], `bean-${index}.svg`, { type: "image/svg+xml" }),
    )

    expect(() =>
      parseBeanMutationInput({
        countryId: "44",
        images,
        name: "Bean",
        roastLevelId: "2",
        tasteTagIds: ["1", "2"],
      }),
    ).toThrowError(AppError)
  })

  it("オファーがある Bean は削除できない", async () => {
    mockPrisma.bean.findFirst.mockResolvedValue({
      _count: {
        offers: 1,
      },
      id: 1n,
    })

    await expect(deleteBean("3", "1")).rejects.toMatchObject({
      code: "FORBIDDEN",
      userMessage: "コーヒー豆はオファー中です",
    })
  })
})
