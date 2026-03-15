import type { RoasterCreateData } from '@/features/roasters/types'

export const createRoasterFormData = (data: RoasterCreateData): FormData => {
  const formData = new FormData()
  // 画像が選択されていない場合は更新しない
  if (data.image[0]) {
    formData.append('roaster[image]', data.image[0])
  }
  formData.append('roaster[name]', data.name)
  formData.append('roaster[phone_number]', data.phoneNumber)
  formData.append('roaster[prefecture_code]', data.prefectureOption.value.toString())
  formData.append('roaster[address]', data.address)
  if (data.describe) {
    formData.append('roaster[describe]', data.describe)
  }
  return formData
}
