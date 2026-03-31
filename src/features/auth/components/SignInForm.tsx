import { signInAction } from "@/server/auth/actions"

type SignInFormProps = {
  defaultEmail?: string
  initialError?: string
}

export function SignInForm({ defaultEmail, initialError }: SignInFormProps) {
  return (
    <form
      action={signInAction}
      className="space-y-4"
    >
      {initialError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {initialError}
        </p>
      ) : null}
      <label className="block space-y-2 text-sm font-medium">
        <span>メールアドレス</span>
        <input
          required
          type="email"
          name="email"
          defaultValue={defaultEmail}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        <span>パスワード</span>
        <input
          required
          type="password"
          name="password"
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        サインイン
      </button>
    </form>
  )
}
