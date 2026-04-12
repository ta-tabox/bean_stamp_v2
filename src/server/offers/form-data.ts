import { parseOfferMutationInput } from "@/server/offers/service"

export function parseOfferMutationFormData(formData: FormData) {
  return parseOfferMutationInput({
    amount: formData.get("amount"),
    beanId: formData.get("beanId"),
    endedAt: formData.get("endedAt"),
    price: formData.get("price"),
    receiptEndedAt: formData.get("receiptEndedAt"),
    receiptStartedAt: formData.get("receiptStartedAt"),
    roastedAt: formData.get("roastedAt"),
    weight: formData.get("weight"),
  })
}
