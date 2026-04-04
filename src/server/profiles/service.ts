import { Prisma } from "@prisma/client"
import { z } from "zod"

import { AppError } from "@/server/errors"
import { prisma } from "@/server/db"
import {
  buildRoasterApiResponse,
  buildRoasterDetailApiResponse,
  buildRoasterRelationshipMutationApiResponse,
  buildRoasterRelationshipStatusApiResponse,
  buildUserApiResponse,
} from "@/server/profiles/dto"

const userProfileSchema = z.object({
  describe: z.string().trim().optional(),
  email: z.email("メールアドレスを確認してください"),
  name: z.string().trim().min(1, "名前を入力してください"),
  prefectureCode: z.string().trim().min(1, "都道府県コードを入力してください"),
})

const roasterProfileSchema = z.object({
  address: z.string().trim().min(1, "住所を入力してください"),
  describe: z.string().trim().optional(),
  name: z.string().trim().min(1, "ロースター名を入力してください"),
  phoneNumber: z.string().trim().min(1, "電話番号を入力してください"),
  prefectureCode: z.string().trim().min(1, "都道府県コードを入力してください"),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>
export type RoasterProfileInput = z.infer<typeof roasterProfileSchema>

const userSelect = {
  describe: true,
  email: true,
  guest: true,
  id: true,
  name: true,
  prefectureCode: true,
  roasterId: true,
} satisfies Prisma.UserSelect

const roasterSelect = {
  address: true,
  describe: true,
  guest: true,
  id: true,
  name: true,
  phoneNumber: true,
  prefectureCode: true,
} satisfies Prisma.RoasterSelect

export function parseUserProfileInput(input: Record<string, unknown>): UserProfileInput {
  const parsed = userProfileSchema.safeParse(input)

  if (!parsed.success) {
    throw new AppError("Invalid user profile input", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: parsed.error.issues[0]?.message ?? "入力内容を確認してください",
    })
  }

  return parsed.data
}

export function parseRoasterProfileInput(input: Record<string, unknown>): RoasterProfileInput {
  const parsed = roasterProfileSchema.safeParse(input)

  if (!parsed.success) {
    throw new AppError("Invalid roaster profile input", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: parsed.error.issues[0]?.message ?? "入力内容を確認してください",
    })
  }

  return parsed.data
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: parseId(userId) },
    select: userSelect,
  })

  if (!user) {
    throw createNotFoundError("ユーザーが存在しません")
  }

  return buildUserApiResponse(user)
}

export async function listRoastersFollowedByUser(userId: string) {
  await ensureUserExists(userId)

  const relationships = await prisma.roasterRelationship.findMany({
    where: { followerId: parseId(userId) },
    orderBy: { id: "asc" },
    select: {
      roaster: {
        select: roasterSelect,
      },
    },
  })

  return relationships.map(({ roaster }) => buildRoasterApiResponse(roaster))
}

export async function updateUserProfile(userId: string, input: UserProfileInput) {
  try {
    const user = await prisma.user.update({
      where: { id: parseId(userId) },
      data: {
        describe: normalizeOptionalText(input.describe),
        email: input.email.trim().toLowerCase(),
        name: input.name.trim(),
        prefectureCode: input.prefectureCode.trim(),
        uid: input.email.trim().toLowerCase(),
      },
      select: userSelect,
    })

    return buildUserApiResponse(user)
  } catch (error) {
    if (isRecordNotFound(error)) {
      throw createNotFoundError("ユーザーが存在しません")
    }

    if (isUniqueConstraint(error)) {
      throw new AppError("Email already exists", {
        cause: error,
        code: "VALIDATION_ERROR",
        status: 422,
        userMessage: "そのメールアドレスは既に使用されています",
      })
    }

    throw error
  }
}

export async function deleteUserProfile(userId: string) {
  const parsedUserId = parseId(userId)
  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
    select: {
      guest: true,
      id: true,
      roasterId: true,
    },
  })

  if (!user) {
    throw createNotFoundError("ユーザーが存在しません")
  }

  if (user.guest) {
    throw new AppError("Guest user cannot be modified", {
      code: "FORBIDDEN",
      status: 400,
      userMessage: "ゲストユーザーの変更はできません",
    })
  }

  if (user.roasterId !== null) {
    throw new AppError("User still belongs to roaster", {
      code: "FORBIDDEN",
      status: 405,
      userMessage: "所属ロースターがあるため先にロースターを削除してください",
    })
  }

  await prisma.$transaction(async (tx) => {
    await tx.roasterRelationship.deleteMany({
      where: { followerId: parsedUserId },
    })
    await tx.user.delete({
      where: { id: parsedUserId },
    })
  })

  return {
    messages: ["ユーザーを削除しました"],
  }
}

export async function getRoasterProfile(roasterId: string, signedInUserId?: string | null) {
  const parsedRoasterId = parseId(roasterId)

  const [roaster, relationship] = await prisma.$transaction([
    prisma.roaster.findUnique({
      where: { id: parsedRoasterId },
      select: {
        ...roasterSelect,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    }),
    signedInUserId
      ? prisma.roasterRelationship.findUnique({
          where: {
            followerId_roasterId: {
              followerId: parseId(signedInUserId),
              roasterId: parsedRoasterId,
            },
          },
          select: {
            id: true,
          },
        })
      : prisma.$queryRaw<{ id: bigint }[]>`SELECT NULL::bigint AS id LIMIT 0`,
  ])

  if (!roaster) {
    throw createNotFoundError("ロースターが存在しません")
  }

  const relationshipId = Array.isArray(relationship) ? null : (relationship?.id ?? null)

  return buildRoasterDetailApiResponse({
    ...roaster,
    followersCount: roaster._count.followers,
    roasterRelationshipId: relationshipId,
  })
}

export async function listRoasterFollowers(roasterId: string) {
  await ensureRoasterExists(roasterId)

  const relationships = await prisma.roasterRelationship.findMany({
    where: { roasterId: parseId(roasterId) },
    orderBy: { id: "asc" },
    select: {
      follower: {
        select: userSelect,
      },
    },
  })

  return relationships.map(({ follower }) => buildUserApiResponse(follower))
}

export async function createRoasterProfile(userId: string, input: RoasterProfileInput) {
  const parsedUserId = parseId(userId)

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: parsedUserId },
      select: {
        roasterId: true,
      },
    })

    if (!user) {
      throw createNotFoundError("ユーザーが存在しません")
    }

    if (user.roasterId !== null) {
      throw new AppError("User already belongs to a roaster", {
        code: "FORBIDDEN",
        status: 405,
        userMessage: "既にロースターに所属しています",
      })
    }

    const roaster = await tx.roaster.create({
      data: buildRoasterMutationData(input),
      select: roasterSelect,
    })

    await tx.user.update({
      where: { id: parsedUserId },
      data: {
        roasterId: roaster.id,
      },
    })

    return buildRoasterDetailApiResponse({
      ...roaster,
      followersCount: 0,
      roasterRelationshipId: null,
    })
  })
}

export async function updateRoasterProfile(
  userId: string,
  roasterId: string,
  input: RoasterProfileInput,
) {
  const parsedRoasterId = parseId(roasterId)
  await ensureRoasterOwnership(userId, parsedRoasterId)

  const roaster = await prisma.roaster.update({
    where: { id: parsedRoasterId },
    data: buildRoasterMutationData(input),
    select: {
      ...roasterSelect,
      _count: {
        select: {
          followers: true,
        },
      },
    },
  })

  return buildRoasterDetailApiResponse({
    ...roaster,
    followersCount: roaster._count.followers,
    roasterRelationshipId: null,
  })
}

export async function deleteRoasterProfile(userId: string, roasterId: string) {
  const parsedRoasterId = parseId(roasterId)
  await ensureRoasterOwnership(userId, parsedRoasterId)

  await prisma.$transaction(async (tx) => {
    await tx.roasterRelationship.deleteMany({
      where: { roasterId: parsedRoasterId },
    })
    await tx.user.updateMany({
      where: { roasterId: parsedRoasterId },
      data: { roasterId: null },
    })
    await tx.roaster.delete({
      where: { id: parsedRoasterId },
    })
  })

  return {
    messages: ["ロースターを削除しました"],
  }
}

export async function getRoasterRelationshipStatus(userId: string, roasterId: string) {
  await ensureRoasterExists(roasterId)

  const relationship = await prisma.roasterRelationship.findUnique({
    where: {
      followerId_roasterId: {
        followerId: parseId(userId),
        roasterId: parseId(roasterId),
      },
    },
    select: {
      id: true,
    },
  })

  return buildRoasterRelationshipStatusApiResponse(relationship?.id ?? null)
}

export async function followRoaster(userId: string, roasterId: string) {
  const parsedUserId = parseId(userId)
  const parsedRoasterId = parseId(roasterId)

  return prisma.$transaction(async (tx) => {
    const [user, roaster] = await Promise.all([
      tx.user.findUnique({
        where: { id: parsedUserId },
        select: {
          id: true,
          name: true,
          roasterId: true,
        },
      }),
      tx.roaster.findUnique({
        where: { id: parsedRoasterId },
        select: {
          id: true,
          name: true,
        },
      }),
    ])

    if (!user) {
      throw createNotFoundError("ユーザーが存在しません")
    }

    if (!roaster) {
      throw createNotFoundError("ロースターが存在しません")
    }

    if (user.roasterId === parsedRoasterId) {
      throw new AppError("Cannot follow own roaster", {
        code: "FORBIDDEN",
        status: 405,
        userMessage: "所属ロースターはフォローできません",
      })
    }

    const existing = await tx.roasterRelationship.findUnique({
      where: {
        followerId_roasterId: {
          followerId: parsedUserId,
          roasterId: parsedRoasterId,
        },
      },
      select: {
        id: true,
      },
    })

    const relationship =
      existing ??
      (await tx.roasterRelationship.create({
        data: {
          followerId: parsedUserId,
          roasterId: parsedRoasterId,
        },
        select: {
          id: true,
        },
      }))

    const [followersCount, followingRoastersCount] = await Promise.all([
      tx.roasterRelationship.count({
        where: { roasterId: parsedRoasterId },
      }),
      tx.roasterRelationship.count({
        where: { followerId: parsedUserId },
      }),
    ])

    return buildRoasterRelationshipMutationApiResponse({
      followersCount,
      followingRoastersCount,
      relationshipId: relationship.id,
      roasterId: roaster.id,
      roasterName: roaster.name,
      userId: user.id,
      userName: user.name,
    })
  })
}

export async function unfollowRoaster(userId: string, relationshipId: string) {
  const parsedUserId = parseId(userId)
  const parsedRelationshipId = parseId(relationshipId)

  return prisma.$transaction(async (tx) => {
    const relationship = await tx.roasterRelationship.findUnique({
      where: { id: parsedRelationshipId },
      select: {
        followerId: true,
        roaster: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!relationship || relationship.followerId !== parsedUserId) {
      throw createNotFoundError("フォローが存在しません")
    }

    const user = await tx.user.findUnique({
      where: { id: parsedUserId },
      select: {
        id: true,
        name: true,
      },
    })

    if (!user) {
      throw createNotFoundError("ユーザーが存在しません")
    }

    await tx.roasterRelationship.delete({
      where: { id: parsedRelationshipId },
    })

    const [followersCount, followingRoastersCount] = await Promise.all([
      tx.roasterRelationship.count({
        where: { roasterId: relationship.roaster.id },
      }),
      tx.roasterRelationship.count({
        where: { followerId: parsedUserId },
      }),
    ])

    return buildRoasterRelationshipMutationApiResponse({
      followersCount,
      followingRoastersCount,
      relationshipId: null,
      roasterId: relationship.roaster.id,
      roasterName: relationship.roaster.name,
      userId: user.id,
      userName: user.name,
    })
  })
}

function buildRoasterMutationData(input: RoasterProfileInput): Prisma.RoasterUncheckedCreateInput {
  return {
    address: input.address.trim(),
    describe: normalizeOptionalText(input.describe),
    name: input.name.trim(),
    phoneNumber: input.phoneNumber.trim(),
    prefectureCode: input.prefectureCode.trim(),
  }
}

function normalizeOptionalText(value?: string | null) {
  const normalized = value?.trim() ?? ""

  return normalized.length > 0 ? normalized : null
}

function parseId(value: string) {
  try {
    return BigInt(value)
  } catch {
    throw createNotFoundError("対象データが存在しません")
  }
}

async function ensureUserExists(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: parseId(userId) },
    select: { id: true },
  })

  if (!user) {
    throw createNotFoundError("ユーザーが存在しません")
  }
}

async function ensureRoasterExists(roasterId: string) {
  const roaster = await prisma.roaster.findUnique({
    where: { id: parseId(roasterId) },
    select: { id: true },
  })

  if (!roaster) {
    throw createNotFoundError("ロースターが存在しません")
  }
}

async function ensureRoasterOwnership(userId: string, roasterId: bigint) {
  const [user, roaster] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: parseId(userId) },
      select: {
        roasterId: true,
      },
    }),
    prisma.roaster.findUnique({
      where: { id: roasterId },
      select: {
        id: true,
      },
    }),
  ])

  if (!roaster) {
    throw createNotFoundError("ロースターが存在しません")
  }

  if (!user || user.roasterId !== roasterId) {
    throw new AppError("Roaster is not owned by current user", {
      code: "FORBIDDEN",
      status: 405,
      userMessage: "所属していないロースターの更新・削除はできません",
    })
  }
}

function createNotFoundError(message: string) {
  return new AppError("Resource not found", {
    code: "NOT_FOUND",
    status: 404,
    userMessage: message,
  })
}

function isRecordNotFound(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
}

function isUniqueConstraint(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}
