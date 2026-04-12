import { parseBeanMutationInput } from "@/server/beans/service"

export function parseBeanMutationFormData(formData: FormData) {
  return parseBeanMutationInput({
    acidity: formData.get("acidity"),
    bitterness: formData.get("bitterness"),
    body: formData.get("body"),
    countryId: formData.get("countryId"),
    croppedAt: formData.get("croppedAt"),
    describe: formData.get("describe"),
    elevation: formData.get("elevation"),
    farm: formData.get("farm"),
    flavor: formData.get("flavor"),
    images: formData.getAll("images"),
    name: formData.get("name"),
    process: formData.get("process"),
    roastLevelId: formData.get("roastLevelId"),
    subregion: formData.get("subregion"),
    sweetness: formData.get("sweetness"),
    tasteTagIds: formData.getAll("tasteTagIds"),
    variety: formData.get("variety"),
  })
}
