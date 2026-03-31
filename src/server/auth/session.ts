export type LegacySessionUser = {
  email: string
  id: string
  name: string
  prefectureCode: string
  roasterId?: string | null
}

export type LegacySessionRoaster = {
  address: string
  id: string
  name: string
  prefectureCode: string
}

type SessionResponseInput = {
  roaster?: LegacySessionRoaster | null
  user: LegacySessionUser
}

export function buildLegacySessionResponse(input?: SessionResponseInput) {
  if (!input) {
    return {
      is_login: false as const,
      message: "ユーザーが存在しません",
    }
  }

  return {
    is_login: true as const,
    roaster: input.roaster
      ? {
          address: input.roaster.address,
          id: input.roaster.id,
          name: input.roaster.name,
          prefecture_code: input.roaster.prefectureCode,
        }
      : null,
    user: {
      email: input.user.email,
      id: input.user.id,
      name: input.user.name,
      prefecture_code: input.user.prefectureCode,
      roaster_id: input.user.roasterId ?? null,
    },
  }
}
