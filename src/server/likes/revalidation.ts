import { revalidatePath } from "next/cache"

export function revalidateLikePaths(offerId?: string) {
  revalidatePath("/likes")
  revalidatePath("/users/home")

  if (offerId) {
    revalidatePath(`/offers/${offerId}`)
  }
}
