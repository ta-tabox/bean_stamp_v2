"use server"

import { redirect } from "next/navigation"

import { requireRoasterMembership } from "@/server/auth/guards"
import { parseBeanMutationFormData } from "@/server/beans/form-data"
import { revalidateBeanPaths } from "@/server/beans/revalidation"
import { createBean, deleteBean, updateBean } from "@/server/beans/service"
import { asAppError } from "@/server/errors"

export async function createBeanAction(formData: FormData) {
  const session = await requireRoasterMembership()

  let beanId: string

  try {
    const bean = await createBean(session.roasterId!, parseBeanMutationFormData(formData))

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
    await updateBean(session.roasterId!, beanId, parseBeanMutationFormData(formData))
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
