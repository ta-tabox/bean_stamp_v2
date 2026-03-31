import { signOutAction } from "@/server/auth/actions"

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
      >
        サインアウト
      </button>
    </form>
  )
}
