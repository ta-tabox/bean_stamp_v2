"use server"

import crypto from "node:crypto"

import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { z } from "zod"

import { loadServerEnv } from "@/env"
import { signIn, signOut } from "@/server/auth/options"
import { hashPassword } from "@/server/auth/password"
import { prisma } from "@/server/db"

const signUpSchema = z
  .object({
    email: z.email(),
    name: z.string().trim().min(1, "名前を入力してください"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    passwordConfirmation: z.string().min(1),
    prefectureCode: z.string().trim().min(1, "都道府県コードを入力してください"),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "確認用パスワードが一致しません",
    path: ["passwordConfirmation"],
  })

const requestResetSchema = z.object({
  email: z.email(),
})

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    passwordConfirmation: z.string().min(1),
    token: z.string().min(1),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "確認用パスワードが一致しません",
    path: ["passwordConfirmation"],
  })

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function encodeMessage(message: string) {
  return encodeURIComponent(message)
}

function createResetPasswordUrl(token: string) {
  const env = loadServerEnv()

  return `${env.NEXTAUTH_URL}/auth/password_reset?token=${token}`
}

async function sendResetPasswordMail(email: string, resetUrl: string) {
  console.info(`[auth] reset password mail to=${email} url=${resetUrl}`)
}

function isE2ETestMode() {
  return process.env.BEAN_STAMP_E2E === "1"
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const password = String(formData.get("password") ?? "")

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/users/home",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/auth/signin?error=${encodeMessage("メールアドレスまたはパスワードが正しくありません")}&email=${encodeURIComponent(email)}`,
      )
    }

    throw error
  }
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signin",
  })
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
    prefectureCode: formData.get("prefectureCode"),
  })

  if (!parsed.success) {
    redirect(
      `/auth/signup?error=${encodeMessage(parsed.error.issues[0]?.message ?? "入力内容を確認してください")}`,
    )
  }

  const email = normalizeEmail(parsed.data.email)
  const existingUser = await prisma.user.findFirst({
    where: { email },
    select: { id: true },
  })

  if (existingUser) {
    redirect(`/auth/signup?error=${encodeMessage("そのメールアドレスは既に使用されています")}`)
  }

  await prisma.user.create({
    data: {
      email,
      encryptedPassword: await hashPassword(parsed.data.password),
      name: parsed.data.name,
      prefectureCode: parsed.data.prefectureCode,
      provider: "credentials",
      uid: email,
    },
  })

  redirect(`/auth/signin?registered=1&email=${encodeURIComponent(email)}`)
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = requestResetSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    redirect(`/auth/password_reset?error=${encodeMessage("メールアドレスを確認してください")}`)
  }

  const email = normalizeEmail(parsed.data.email)
  const user = await prisma.user.findFirst({
    where: { email },
    select: { email: true, id: true },
  })

  let developmentToken: string | null = null

  if (user) {
    const token = crypto.randomUUID()

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordSentAt: new Date(),
        resetPasswordToken: token,
      },
    })

    await sendResetPasswordMail(user.email, createResetPasswordUrl(token))

    if (process.env.NODE_ENV !== "production" || isE2ETestMode()) {
      developmentToken = token
    }
  }

  const developmentQuery = developmentToken ? `&devToken=${developmentToken}` : ""

  redirect(`/auth/password_reset?sent=1${developmentQuery}`)
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
    token: formData.get("token"),
  })

  if (!parsed.success) {
    const token = String(formData.get("token") ?? "")

    redirect(
      `/auth/password_reset?token=${encodeURIComponent(token)}&error=${encodeMessage(parsed.error.issues[0]?.message ?? "入力内容を確認してください")}`,
    )
  }

  const user = await prisma.user.findFirst({
    where: { resetPasswordToken: parsed.data.token },
    select: { id: true },
  })

  if (!user) {
    redirect(`/auth/password_reset?error=${encodeMessage("再設定トークンが無効です")}`)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      encryptedPassword: await hashPassword(parsed.data.password),
      resetPasswordSentAt: null,
      resetPasswordToken: null,
    },
  })

  redirect("/auth/signin?reset=1")
}
