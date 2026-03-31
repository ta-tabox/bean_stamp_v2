import Link from "next/link"

import { AuthFormShell } from "@/features/auth/components/AuthFormShell"
import { AuthStatusMessage } from "@/features/auth/components/AuthStatusMessage"
import { requestPasswordResetAction, resetPasswordAction } from "@/server/auth/actions"

type PasswordResetPageProps = {
  searchParams?: Promise<{
    devToken?: string
    error?: string
    sent?: string
    token?: string
  }>
}

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
  const params = (await searchParams) ?? {}
  const token = params.token

  return (
    <AuthFormShell
      title="Password reset"
      description={
        token
          ? "新しいパスワードを設定します。"
          : "登録済みメールアドレスへパスワード再設定リンクを送信します。"
      }
      footer={
        <Link
          className="underline underline-offset-4"
          href="/auth/signin"
        >
          サインイン画面へ戻る
        </Link>
      }
    >
      <div className="space-y-4">
        {params.error ? <AuthStatusMessage tone="error">{params.error}</AuthStatusMessage> : null}
        {params.sent === "1" ? (
          <AuthStatusMessage>
            パスワード再設定メールを送信しました。開発環境では下のリンクから続行できます。
          </AuthStatusMessage>
        ) : null}
        {params.devToken ? (
          <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-3 text-sm">
            開発用リンク:{" "}
            <Link
              href={`/auth/password_reset?token=${params.devToken}`}
              className="font-semibold underline underline-offset-4"
            >
              パスワードを再設定する
            </Link>
          </p>
        ) : null}
        {token ? (
          <form
            action={resetPasswordAction}
            className="space-y-4"
          >
            <input
              type="hidden"
              name="token"
              value={token}
            />
            <label className="block space-y-2 text-sm font-medium">
              <span>新しいパスワード</span>
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
              パスワードを更新する
            </button>
          </form>
        ) : (
          <form
            action={requestPasswordResetAction}
            className="space-y-4"
          >
            <label className="block space-y-2 text-sm font-medium">
              <span>メールアドレス</span>
              <input
                required
                type="email"
                name="email"
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              再設定メールを送る
            </button>
          </form>
        )}
      </div>
    </AuthFormShell>
  )
}
