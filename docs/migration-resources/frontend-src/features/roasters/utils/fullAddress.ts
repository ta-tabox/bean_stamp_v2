import type { Roaster } from '@/features/roasters/types'
import { translatePrefectureCodeToName } from '@/utils/prefecture'

type Option = {
  roaster: Roaster
}

export const fullAddress = ({ roaster }: Option) =>
  translatePrefectureCodeToName({ prefectureCode: roaster.prefectureCode }) + roaster.address
