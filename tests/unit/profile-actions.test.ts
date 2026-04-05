import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  parseRoasterProfileInputMock,
  redirectMock,
  requireRoasterMembershipMock,
  revalidatePathMock,
  updateRoasterProfileMock,
} = vi.hoisted(() => ({
  parseRoasterProfileInputMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new RedirectError(location)
  }),
  requireRoasterMembershipMock: vi.fn(),
  revalidatePathMock: vi.fn(),
  updateRoasterProfileMock: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}))

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}))

vi.mock("@/server/auth/guards", () => ({
  requireRoasterMembership: requireRoasterMembershipMock,
  requireNoRoasterMembership: vi.fn(),
  requireSession: vi.fn(),
}))

vi.mock("@/server/auth/options", () => ({
  signOut: vi.fn(),
}))

vi.mock("@/server/profiles/service", () => ({
  createRoasterProfile: vi.fn(),
  deleteRoasterProfile: vi.fn(),
  deleteUserProfile: vi.fn(),
  followRoaster: vi.fn(),
  parseRoasterProfileInput: parseRoasterProfileInputMock,
  parseUserProfileInput: vi.fn(),
  unfollowRoaster: vi.fn(),
  updateRoasterProfile: updateRoasterProfileMock,
  updateUserProfile: vi.fn(),
}))

import { updateRoasterProfileAction } from "@/server/profiles/actions"

describe("profiles/actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireRoasterMembershipMock.mockResolvedValue({
      id: "10",
      roasterId: "5",
    })
    parseRoasterProfileInputMock.mockReturnValue({
      address: "Tokyo",
      describe: "desc",
      imageUrl: "https://example.com/roaster.png",
      name: "Roaster",
      phoneNumber: "03-0000-0000",
      prefectureCode: "13",
    })
  })

  it("ロースター更新時に imageUrl を含めて入力を組み立てる", async () => {
    const formData = new FormData()
    formData.set("name", "Roaster")
    formData.set("phoneNumber", "03-0000-0000")
    formData.set("prefectureCode", "13")
    formData.set("address", "Tokyo")
    formData.set("imageUrl", "https://example.com/roaster.png")
    formData.set("describe", "desc")

    await expect(updateRoasterProfileAction(formData)).rejects.toEqual(
      new RedirectError("/roasters/5?updated=1"),
    )

    expect(parseRoasterProfileInputMock).toHaveBeenCalledWith({
      address: "Tokyo",
      describe: "desc",
      imageUrl: "https://example.com/roaster.png",
      name: "Roaster",
      phoneNumber: "03-0000-0000",
      prefectureCode: "13",
    })
    expect(updateRoasterProfileMock).toHaveBeenCalledWith("10", "5", {
      address: "Tokyo",
      describe: "desc",
      imageUrl: "https://example.com/roaster.png",
      name: "Roaster",
      phoneNumber: "03-0000-0000",
      prefectureCode: "13",
    })
    expect(revalidatePathMock).toHaveBeenCalledWith("/roasters/5")
  })
})

class RedirectError extends Error {
  constructor(readonly location: string) {
    super(`Redirect to ${location}`)
  }
}
