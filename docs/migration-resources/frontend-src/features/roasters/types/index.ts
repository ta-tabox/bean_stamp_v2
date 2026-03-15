import type { PrefectureOption } from '@/utils/prefecture'

export type Roaster = {
  id: number
  name: string
  phoneNumber: string
  prefectureCode: string
  describe: string | null
  imageUrl: string | null
  thumbnailUrl: string | null
  address: string
  guest: boolean
  followersCount: number
}

// react-hook-formで取り扱うデータの型
export type RoasterCreateData = Pick<Roaster, 'name' | 'phoneNumber' | 'prefectureCode' | 'describe' | 'address'> & {
  image: string
  prefectureOption: PrefectureOption
}
