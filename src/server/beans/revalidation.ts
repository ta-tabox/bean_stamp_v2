import { revalidatePath } from "next/cache"

export function revalidateBeanPaths(beanId: string) {
  revalidatePath("/beans")
  revalidatePath("/beans/new")
  revalidatePath(`/beans/${beanId}`)
  revalidatePath(`/beans/${beanId}/edit`)
  revalidatePath("/roasters/home")
}
