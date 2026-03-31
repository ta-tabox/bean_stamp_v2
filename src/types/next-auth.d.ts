import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      prefectureCode: string
      roasterId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    prefectureCode: string
    roasterId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    prefectureCode?: string
    roasterId?: string | null
  }
}
