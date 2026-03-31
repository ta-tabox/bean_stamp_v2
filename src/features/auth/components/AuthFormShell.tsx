import type { ReactNode } from "react"

type AuthFormShellProps = {
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}

export function AuthFormShell({ children, description, footer, title }: AuthFormShellProps) {
  return (
    <main className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_24px_90px_rgba(82,53,22,0.08)] backdrop-blur sm:p-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Auth
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
            {description}
          </p>
        </div>
        {children}
        {footer ? (
          <div className="border-t border-[var(--color-border)] pt-4 text-sm">{footer}</div>
        ) : null}
      </div>
    </main>
  )
}
