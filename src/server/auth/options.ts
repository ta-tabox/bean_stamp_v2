import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { loadServerEnv } from "@/env"
import { verifyPassword } from "@/server/auth/password"
import { prisma } from "@/server/db"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(String(credentials?.email ?? ""))
        const password = String(credentials?.password ?? "")

        if (!email || !password) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: { email },
          select: {
            email: true,
            encryptedPassword: true,
            id: true,
            name: true,
            prefectureCode: true,
            roasterId: true,
          },
        })

        if (!user) {
          return null
        }

        const isValidPassword = await verifyPassword(password, user.encryptedPassword)

        if (!isValidPassword) {
          return null
        }

        return {
          email: user.email,
          id: user.id.toString(),
          name: user.name,
          prefectureCode: user.prefectureCode,
          roasterId: user.roasterId?.toString() ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.prefectureCode = user.prefectureCode
        token.roasterId = user.roasterId ?? null
      }

      return token
    },
    async session({ session, token }) {
      if (!session.user) {
        return session
      }

      session.user = {
        ...session.user,
        email: token.email ?? session.user.email ?? "",
        id: token.sub ?? "",
        name: token.name ?? session.user.name ?? "",
        prefectureCode: typeof token.prefectureCode === "string" ? token.prefectureCode : "",
        roasterId:
          typeof token.roasterId === "string" || token.roasterId === null ? token.roasterId : null,
      }

      return session
    },
  },
  secret: loadServerEnv().NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig)
