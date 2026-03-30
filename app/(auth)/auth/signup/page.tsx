import Link from "next/link"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthStatusMessage } from "@/features/auth/components/auth-status-message"
import { signUpAction } from "@/server/auth/actions"

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = (await searchParams) ?? {}

  return (
    <AuthFormShell
      title="Sign up"
      description="Bean Stamp のユーザーアカウントを作成します。"
      footer={
        <Link
          className="underline underline-offset-4"
          href="/auth/signin"
        >
          すでにアカウントをお持ちの場合
        </Link>
      }
    >
      <form
        action={signUpAction}
        className="space-y-4"
      >
        {params.error ? <AuthStatusMessage tone="error">{params.error}</AuthStatusMessage> : null}
        <label className="block space-y-2 text-sm font-medium">
          <span>名前</span>
          <input
            required
            type="text"
            name="name"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>メールアドレス</span>
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>都道府県コード</span>
          <input
            required
            type="text"
            name="prefectureCode"
            placeholder="13"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>パスワード</span>
          <input
            required
            type="password"
            name="password"
            minLength={8}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>確認用パスワード</span>
          <input
            required
            type="password"
            name="passwordConfirmation"
            minLength={8}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          登録する
        </button>
      </form>
    </AuthFormShell>
  )
}
