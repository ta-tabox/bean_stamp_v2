import { revalidatePath } from "next/cache"

export function revalidateOfferPaths(offerId?: string) {
  revalidatePath("/offers")
  revalidatePath("/offers/new")
  revalidatePath("/beans")
  revalidatePath("/roasters/home")
  revalidatePath("/users/home")

  if (!offerId) {
    return
  }

  revalidatePath(`/offers/${offerId}`)
  revalidatePath(`/offers/${offerId}/edit`)
  revalidatePath(`/offers/${offerId}/wanted_users`)
}
