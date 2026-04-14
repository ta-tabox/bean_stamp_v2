import { getSessionPrincipal } from "@/server/auth/guards"
import { AppError } from "@/server/errors"

export async function requireApiSession() {
  const session = await getSessionPrincipal()

  if (!session) {
    throw new AppError("Authentication required", {
      code: "UNAUTHORIZED",
      status: 401,
      userMessage: "認証が必要です",
    })
  }

  return session
}

export async function requireApiRoasterSession() {
  const session = await requireApiSession()

  if (!session.roasterId) {
    throw new AppError("Roaster membership required", {
      code: "FORBIDDEN",
      status: 403,
      userMessage: "ロースター登録が必要です",
    })
  }

  return {
    ...session,
    roasterId: session.roasterId,
  }
}
