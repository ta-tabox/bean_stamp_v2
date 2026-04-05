type BeanTasteTagDtoInput = {
  tasteTag: {
    id: bigint
    name: string | null
  }
}

type BeanDtoInput = {
  acidity: number | null
  beanImages: Array<{
    image: string | null
  }>
  beanTasteTags: BeanTasteTagDtoInput[]
  bitterness: number | null
  body: number | null
  country: {
    id: bigint
    name: string | null
  }
  croppedAt: Date | null
  describe: string | null
  elevation: number | null
  farm: string
  flavor: number | null
  id: bigint
  name: string | null
  process: string
  roastLevel: {
    id: bigint
    name: string | null
  }
  roasterId: bigint
  subregion: string
  sweetness: number | null
  variety: string
}

export type BeanApiResponse = {
  acidity: number
  bitterness: number
  body: number
  country: {
    id: number
    name: string
  }
  cropped_at: string | null
  describe: string | null
  elevation: number | null
  farm: string | null
  flavor: number
  id: number
  image_urls: string[]
  name: string
  process: string | null
  roast_level: {
    id: number
    name: string
  }
  roaster_id: number
  subregion: string | null
  sweetness: number
  taste: {
    ids: number[]
    names: string[]
  }
  thumbnail_url: string | null
  variety: string | null
}

export function buildBeanApiResponse(input: BeanDtoInput): BeanApiResponse {
  const imageUrls = input.beanImages.flatMap((beanImage) =>
    beanImage.image ? [beanImage.image] : [],
  )
  const tastes = input.beanTasteTags
    .map(({ tasteTag }) => ({
      id: Number(tasteTag.id),
      name: tasteTag.name,
    }))
    .filter((tasteTag) => tasteTag.id > 0 && tasteTag.name)

  return {
    acidity: input.acidity ?? 0,
    bitterness: input.bitterness ?? 0,
    body: input.body ?? 0,
    country: {
      id: Number(input.country.id),
      name: input.country.name?.trim() || "未設定",
    },
    cropped_at: input.croppedAt ? input.croppedAt.toISOString().slice(0, 7) : null,
    describe: normalizeNullableText(input.describe),
    elevation: input.elevation,
    farm: normalizeNullableText(input.farm),
    flavor: input.flavor ?? 0,
    id: Number(input.id),
    image_urls: imageUrls,
    name: input.name?.trim() || "名称未設定",
    process: normalizeNullableText(input.process),
    roast_level: {
      id: Number(input.roastLevel.id),
      name: input.roastLevel.name?.trim() || "未設定",
    },
    roaster_id: Number(input.roasterId),
    subregion: normalizeNullableText(input.subregion),
    sweetness: input.sweetness ?? 0,
    taste: {
      ids: tastes.map((tasteTag) => tasteTag.id),
      names: tastes.flatMap((tasteTag) => (tasteTag.name ? [tasteTag.name] : [])),
    },
    thumbnail_url: imageUrls[0] ?? null,
    variety: normalizeNullableText(input.variety),
  }
}

function normalizeNullableText(value: string | null) {
  const trimmed = value?.trim()

  return trimmed ? trimmed : null
}
