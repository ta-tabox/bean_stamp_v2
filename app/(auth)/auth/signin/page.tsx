import Link from "next/link"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthStatusMessage } from "@/features/auth/components/auth-status-message"
import { SignInForm } from "@/features/auth/components/sign-in-form"

type SignInPageProps = {
  searchParams?: Promise<{
    email?: string
    error?: string
    registered?: string
    reset?: string
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {}

  return (
    <AuthFormShell
      title="Sign in"
      description="メールアドレスとパスワードでサインインします。"
      footer={
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            className="underline underline-offset-4"
            href="/auth/signup"
          >
            新規登録
          </Link>
          <Link
            className="underline underline-offset-4"
            href="/auth/password_reset"
          >
            パスワードを忘れた場合
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {params.registered === "1" ? (
          <AuthStatusMessage>登録が完了しました。サインインしてください。</AuthStatusMessage>
        ) : null}
        {params.reset === "1" ? (
          <AuthStatusMessage>
            パスワードを更新しました。新しいパスワードでサインインしてください。
          </AuthStatusMessage>
        ) : null}
        <SignInForm
          defaultEmail={params.email}
          initialError={params.error}
        />
      </div>
    </AuthFormShell>
  )
}
