import { revalidatePath } from "next/cache"

export function revalidateWantPaths(offerId?: string, wantId?: string) {
  revalidatePath("/wants")
  revalidatePath("/likes")
  revalidatePath("/users/home")
  revalidatePath("/offers")
  revalidatePath("/roasters/home")

  if (offerId) {
    revalidatePath(`/offers/${offerId}`)
    revalidatePath(`/offers/${offerId}/wanted_users`)
  }

  if (wantId) {
    revalidatePath(`/wants/${wantId}`)
  }
}
