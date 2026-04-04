"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  requireNoRoasterMembership,
  requireRoasterMembership,
  requireSession,
} from "@/server/auth/guards"
import { signOut } from "@/server/auth/options"
import {
  createRoasterProfile,
  deleteRoasterProfile,
  deleteUserProfile,
  followRoaster,
  parseRoasterProfileInput,
  parseUserProfileInput,
  unfollowRoaster,
  updateRoasterProfile,
  updateUserProfile,
} from "@/server/profiles/service"

export async function updateUserProfileAction(formData: FormData) {
  const session = await requireSession()
  const payload = parseUserProfileInput({
    describe: formData.get("describe"),
    email: formData.get("email"),
    imageUrl: formData.get("imageUrl"),
    name: formData.get("name"),
    prefectureCode: formData.get("prefectureCode"),
  })

  await updateUserProfile(session.id, payload)
  revalidateProfilePaths(session.id, session.roasterId)
  redirect(`/users/${session.id}?updated=1`)
}

export async function deleteUserProfileAction() {
  const session = await requireSession()

  await deleteUserProfile(session.id)
  await signOut({
    redirect: false,
  })
  revalidateProfilePaths(session.id, session.roasterId)
  redirect("/auth/signin?deleted=1")
}

export async function createRoasterProfileAction(formData: FormData) {
  const session = await requireNoRoasterMembership()
  const payload = parseRoasterProfileInput({
    address: formData.get("address"),
    describe: formData.get("describe"),
    imageUrl: formData.get("imageUrl"),
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    prefectureCode: formData.get("prefectureCode"),
  })

  const roaster = await createRoasterProfile(session.id, payload)
  revalidateProfilePaths(session.id, String(roaster.id))
  redirect(`/roasters/${roaster.id}?created=1`)
}

export async function updateRoasterProfileAction(formData: FormData) {
  const session = await requireRoasterMembership()
  const payload = parseRoasterProfileInput({
    address: formData.get("address"),
    describe: formData.get("describe"),
    imageUrl: formData.get("imageUrl"),
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    prefectureCode: formData.get("prefectureCode"),
  })

  await updateRoasterProfile(session.id, session.roasterId!, payload)
  revalidateProfilePaths(session.id, session.roasterId)
  redirect(`/roasters/${session.roasterId}?updated=1`)
}

export async function deleteRoasterProfileAction() {
  const session = await requireRoasterMembership()

  await deleteRoasterProfile(session.id, session.roasterId!)
  revalidateProfilePaths(session.id, session.roasterId)
  redirect("/roasters/home?deleted=1")
}

export async function followRoasterAction(formData: FormData) {
  const session = await requireSession()
  const roasterId = String(formData.get("roasterId") ?? "")

  await followRoaster(session.id, roasterId)
  revalidateProfilePaths(session.id, roasterId)
  redirect(`/roasters/${roasterId}?followed=1`)
}

export async function unfollowRoasterAction(formData: FormData) {
  const session = await requireSession()
  const relationshipId = String(formData.get("relationshipId") ?? "")
  const roasterId = String(formData.get("roasterId") ?? "")

  await unfollowRoaster(session.id, relationshipId)
  revalidateProfilePaths(session.id, roasterId)
  redirect(`/roasters/${roasterId}?unfollowed=1`)
}

function revalidateProfilePaths(userId: string, roasterId?: string | null) {
  revalidatePath("/users/home")
  revalidatePath(`/users/${userId}`)
  revalidatePath(`/users/${userId}/following`)
  revalidatePath("/users/edit")
  revalidatePath("/roasters/home")
  revalidatePath("/roasters/new")
  revalidatePath("/roasters/edit")

  if (roasterId) {
    revalidatePath(`/roasters/${roasterId}`)
    revalidatePath(`/roasters/${roasterId}/follower`)
  }
}
