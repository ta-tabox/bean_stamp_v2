import type { BeanCreateUpdateData } from '@/features/beans/types'

export const createBeanFormData = (data: BeanCreateUpdateData): FormData => {
  const formData = new FormData()
  // 画像が選択されていない場合は更新しない
  if (data.images) {
    // FileListを配列として取り扱う
    const beanImages = Array.from(data.images)

    beanImages.forEach((image) => {
      formData.append('beanImage[images][]', image)
    })
  }

  // tasteTagOptionからidの配列を作成、formに渡す
  if (data.tasteTagOptions) {
    const tasteTagIds = data.tasteTagOptions.map((tasteTagOption) => tasteTagOption.value)
    tasteTagIds.forEach((tasteTagId) => {
      formData.append('tasteTag[tasteTagIds][]', tasteTagId.toString())
    })
  }

  formData.append('bean[name]', data.name)
  formData.append('bean[subregion]', data.subregion || '')
  formData.append('bean[farm]', data.farm || '')
  formData.append('bean[variety]', data.variety || '')
  formData.append('bean[elevation]', data.elevation?.toString() || '')
  formData.append('bean[process]', data.process || '')
  formData.append('bean[croppedAt]', data.croppedAt || '')
  formData.append('bean[describe]', data.describe || '')
  formData.append('bean[acidity]', data.acidity.toString())
  formData.append('bean[flavor]', data.flavor.toString())
  formData.append('bean[body]', data.body.toString())
  formData.append('bean[bitterness]', data.bitterness.toString())
  formData.append('bean[sweetness]', data.sweetness.toString())
  formData.append('bean[countryId]', data.countryOption.value.toString())
  formData.append('bean[roastLevelId]', data.roastLevelOption.value.toString())

  return formData
}
