import { Prisma } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/server/db"
import { AppError } from "@/server/errors"

import { buildBeanApiResponse } from "@/server/beans/dto"

const MAX_BEAN_IMAGE_COUNT = 4
const MAX_BEAN_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

const beanMutationSchema = z.object({
  acidity: z.number().int().min(1).max(5).default(3),
  bitterness: z.number().int().min(1).max(5).default(3),
  body: z.number().int().min(1).max(5).default(3),
  countryId: z.number().int().min(1, "生産国を選択してください"),
  croppedAt: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "収穫時期を確認してください")
    .nullable(),
  describe: z.string().trim().max(1000, "紹介文は1000文字以内で入力してください").nullable(),
  elevation: z.number().int().min(0, "標高を確認してください").max(99999).nullable(),
  farm: z.string().trim().max(255).nullable(),
  flavor: z.number().int().min(1).max(5).default(3),
  name: z.string().trim().min(1, "豆の名前を入力してください").max(255),
  process: z.string().trim().max(255).nullable(),
  roastLevelId: z.number().int().min(1, "焙煎度を選択してください"),
  subregion: z.string().trim().max(255).nullable(),
  sweetness: z.number().int().min(1).max(5).default(3),
  tasteTagIds: z
    .array(z.number().int().min(1))
    .min(2, "フレーバーは2個以上登録してください")
    .max(3, "フレーバーは最大3個まで登録できます")
    .refine((value) => new Set(value).size === value.length, {
      message: "フレーバーは重複せずに選択してください",
    }),
  variety: z.string().trim().max(255).nullable(),
})

export type BeanMutationInput = z.infer<typeof beanMutationSchema> & {
  images: File[]
}

const beanDetailSelect = {
  acidity: true,
  beanImages: {
    orderBy: {
      id: "asc",
    },
    select: {
      image: true,
    },
  },
  beanTasteTags: {
    orderBy: {
      id: "asc",
    },
    select: {
      tasteTag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  bitterness: true,
  body: true,
  country: {
    select: {
      id: true,
      name: true,
    },
  },
  croppedAt: true,
  describe: true,
  elevation: true,
  farm: true,
  flavor: true,
  id: true,
  name: true,
  process: true,
  roastLevel: {
    select: {
      id: true,
      name: true,
    },
  },
  roasterId: true,
  subregion: true,
  sweetness: true,
  variety: true,
} satisfies Prisma.BeanSelect

export function parseBeanMutationInput(input: Record<string, unknown>): BeanMutationInput {
  const images = readImageFiles(input.images)
  validateImageFiles(images)

  const parsed = beanMutationSchema.safeParse({
    acidity: readRating(input.acidity),
    bitterness: readRating(input.bitterness),
    body: readRating(input.body),
    countryId: readRequiredInteger(input.countryId),
    croppedAt: readMonth(input.croppedAt),
    describe: readOptionalText(input.describe),
    elevation: readOptionalInteger(input.elevation),
    farm: readOptionalText(input.farm),
    flavor: readRating(input.flavor),
    name: readRequiredText(input.name),
    process: readOptionalText(input.process),
    roastLevelId: readRequiredInteger(input.roastLevelId),
    subregion: readOptionalText(input.subregion),
    sweetness: readRating(input.sweetness),
    tasteTagIds: readIntegerArray(input.tasteTagIds),
    variety: readOptionalText(input.variety),
  })

  if (!parsed.success) {
    throw new AppError("Invalid bean input", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: parsed.error.issues[0]?.message ?? "入力内容を確認してください",
    })
  }

  return {
    ...parsed.data,
    images,
  }
}

export async function listBeansForRoaster(roasterId: string) {
  const beans = await prisma.bean.findMany({
    where: {
      roasterId: parseId(roasterId, "ロースターID"),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: beanDetailSelect,
  })

  return beans.map((bean) => buildBeanApiResponse(bean))
}

export async function getBeanForRoaster(roasterId: string, beanId: string) {
  const bean = await prisma.bean.findFirst({
    where: {
      id: parseId(beanId, "コーヒー豆ID"),
      roasterId: parseId(roasterId, "ロースターID"),
    },
    select: beanDetailSelect,
  })

  if (!bean) {
    throw createBeanNotFoundError()
  }

  return buildBeanApiResponse(bean)
}

export async function createBean(roasterId: string, input: BeanMutationInput) {
  const imageUrls = await Promise.all(input.images.map(convertImageToDataUrl))
  const bean = await prisma.bean.create({
    data: {
      acidity: input.acidity,
      beanImages: imageUrls.length
        ? {
            create: imageUrls.map((image) => ({
              image,
            })),
          }
        : undefined,
      beanTasteTags: {
        create: input.tasteTagIds.map((tasteTagId) => ({
          tasteTagId: BigInt(tasteTagId),
        })),
      },
      bitterness: input.bitterness,
      body: input.body,
      countryId: BigInt(input.countryId),
      croppedAt: input.croppedAt ? new Date(`${input.croppedAt}-01T00:00:00.000Z`) : null,
      describe: input.describe,
      elevation: input.elevation,
      farm: input.farm ?? "",
      flavor: input.flavor,
      name: input.name,
      process: input.process ?? "",
      roastLevelId: BigInt(input.roastLevelId),
      roasterId: parseId(roasterId, "ロースターID"),
      subregion: input.subregion ?? "",
      sweetness: input.sweetness,
      variety: input.variety ?? "",
    },
    select: beanDetailSelect,
  })

  return buildBeanApiResponse(bean)
}

export async function updateBean(roasterId: string, beanId: string, input: BeanMutationInput) {
  const parsedBeanId = parseId(beanId, "コーヒー豆ID")
  const parsedRoasterId = parseId(roasterId, "ロースターID")
  const imageUrls = await Promise.all(input.images.map(convertImageToDataUrl))

  const bean = await prisma.$transaction(async (tx) => {
    const existingBean = await tx.bean.findFirst({
      where: {
        id: parsedBeanId,
        roasterId: parsedRoasterId,
      },
      select: {
        id: true,
      },
    })

    if (!existingBean) {
      throw createBeanNotFoundError()
    }

    await tx.beanTasteTag.deleteMany({
      where: {
        beanId: parsedBeanId,
      },
    })

    if (imageUrls.length) {
      await tx.beanImage.deleteMany({
        where: {
          beanId: parsedBeanId,
        },
      })
    }

    await tx.bean.update({
      where: {
        id: parsedBeanId,
      },
      data: {
        acidity: input.acidity,
        bitterness: input.bitterness,
        body: input.body,
        countryId: BigInt(input.countryId),
        croppedAt: input.croppedAt ? new Date(`${input.croppedAt}-01T00:00:00.000Z`) : null,
        describe: input.describe,
        elevation: input.elevation,
        farm: input.farm ?? "",
        flavor: input.flavor,
        name: input.name,
        process: input.process ?? "",
        roastLevelId: BigInt(input.roastLevelId),
        subregion: input.subregion ?? "",
        sweetness: input.sweetness,
        variety: input.variety ?? "",
      },
    })

    await tx.beanTasteTag.createMany({
      data: input.tasteTagIds.map((tasteTagId) => ({
        beanId: parsedBeanId,
        tasteTagId: BigInt(tasteTagId),
      })),
    })

    if (imageUrls.length) {
      await tx.beanImage.createMany({
        data: imageUrls.map((image) => ({
          beanId: parsedBeanId,
          image,
        })),
      })
    }

    const updatedBean = await tx.bean.findUnique({
      where: {
        id: parsedBeanId,
      },
      select: beanDetailSelect,
    })

    if (!updatedBean) {
      throw createBeanNotFoundError()
    }

    return updatedBean
  })

  return buildBeanApiResponse(bean)
}

export async function deleteBean(roasterId: string, beanId: string) {
  const parsedBeanId = parseId(beanId, "コーヒー豆ID")
  const existingBean = await prisma.bean.findFirst({
    where: {
      id: parsedBeanId,
      roasterId: parseId(roasterId, "ロースターID"),
    },
    select: {
      _count: {
        select: {
          offers: true,
        },
      },
      id: true,
    },
  })

  if (!existingBean) {
    throw createBeanNotFoundError()
  }

  if (existingBean._count.offers > 0) {
    throw new AppError("Bean has active offers", {
      code: "FORBIDDEN",
      status: 405,
      userMessage: "コーヒー豆はオファー中です",
    })
  }

  await prisma.$transaction(async (tx) => {
    await tx.beanImage.deleteMany({
      where: {
        beanId: parsedBeanId,
      },
    })
    await tx.beanTasteTag.deleteMany({
      where: {
        beanId: parsedBeanId,
      },
    })
    await tx.bean.delete({
      where: {
        id: parsedBeanId,
      },
    })
  })

  return {
    messages: ["コーヒー豆を削除しました"],
  }
}

function createBeanNotFoundError() {
  return new AppError("Bean not found", {
    code: "NOT_FOUND",
    status: 404,
    userMessage: "コーヒー豆を登録してください",
  })
}

function parseId(value: string, label: string) {
  if (!/^\d+$/.test(value)) {
    throw new AppError("Invalid id", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: `${label}を確認してください`,
    })
  }

  return BigInt(value)
}

function readRequiredText(value: unknown) {
  return String(value ?? "").trim()
}

function readOptionalText(value: unknown) {
  const text = String(value ?? "").trim()

  return text ? text : null
}

function readRequiredInteger(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value
  }

  const text = String(value ?? "").trim()

  return Number(text)
}

function readOptionalInteger(value: unknown) {
  const text = String(value ?? "").trim()

  if (!text) {
    return null
  }

  return Number(text)
}

function readRating(value: unknown) {
  const text = String(value ?? "").trim()

  if (!text) {
    return 3
  }

  return Number(text)
}

function readMonth(value: unknown) {
  const text = String(value ?? "").trim()

  return text ? text : null
}

function readIntegerArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    const text = String(item ?? "").trim()

    return text ? [Number(text)] : []
  })
}

function readImageFiles(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is File => item instanceof File && item.size > 0)
}

function validateImageFiles(images: File[]) {
  if (images.length > MAX_BEAN_IMAGE_COUNT) {
    throw new AppError("Too many bean images", {
      code: "VALIDATION_ERROR",
      status: 422,
      userMessage: `画像は最大${MAX_BEAN_IMAGE_COUNT}枚まで投稿できます`,
    })
  }

  for (const image of images) {
    if (!image.type.startsWith("image/")) {
      throw new AppError("Invalid bean image type", {
        code: "VALIDATION_ERROR",
        status: 422,
        userMessage: "画像ファイルを選択してください",
      })
    }

    if (image.size > MAX_BEAN_IMAGE_SIZE_BYTES) {
      throw new AppError("Bean image too large", {
        code: "VALIDATION_ERROR",
        status: 422,
        userMessage: "画像は最大5MBのサイズまで投稿できます",
      })
    }
  }
}

async function convertImageToDataUrl(image: File) {
  const buffer = Buffer.from(await image.arrayBuffer())

  return `data:${image.type};base64,${buffer.toString("base64")}`
}
