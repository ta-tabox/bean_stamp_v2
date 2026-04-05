"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createBean, deleteBean, parseBeanMutationInput, updateBean } from "@/server/beans/service"
import { requireRoasterMembership } from "@/server/auth/guards"
import { asAppError } from "@/server/errors"

export async function createBeanAction(formData: FormData) {
  const session = await requireRoasterMembership()

  let beanId: string

  try {
    const bean = await createBean(
      session.roasterId!,
      parseBeanMutationInput({
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
      }),
    )

    beanId = String(bean.id)
  } catch (error) {
    redirect(`/beans/new?error=${encodeURIComponent(asAppError(error).userMessage)}`)
  }

  revalidateBeanPaths(beanId)
  redirect(`/beans/${beanId}?created=1`)
}

export async function updateBeanAction(formData: FormData) {
  const session = await requireRoasterMembership()
  const beanId = String(formData.get("beanId") ?? "")

  try {
    await updateBean(
      session.roasterId!,
      beanId,
      parseBeanMutationInput({
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
      }),
    )
  } catch (error) {
    redirect(`/beans/${beanId}/edit?error=${encodeURIComponent(asAppError(error).userMessage)}`)
  }

  revalidateBeanPaths(beanId)
  redirect(`/beans/${beanId}?updated=1`)
}

export async function deleteBeanAction(formData: FormData) {
  const session = await requireRoasterMembership()
  const beanId = String(formData.get("beanId") ?? "")

  try {
    await deleteBean(session.roasterId!, beanId)
  } catch (error) {
    redirect(`/beans/${beanId}?error=${encodeURIComponent(asAppError(error).userMessage)}`)
  }

  revalidateBeanPaths(beanId)
  redirect("/beans?deleted=1")
}

function revalidateBeanPaths(beanId: string) {
  revalidatePath("/beans")
  revalidatePath("/beans/new")
  revalidatePath(`/beans/${beanId}`)
  revalidatePath(`/beans/${beanId}/edit`)
  revalidatePath("/roasters/home")
}
