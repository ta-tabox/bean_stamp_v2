import type { ReactNode } from "react"

type AuthFormShellProps = {
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}

export function AuthFormShell({ children, description, footer, title }: AuthFormShellProps) {
  return (
    <main className="form-shell">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-3">
          <p className="panel-label">Auth</p>
          <h2 className="title-font text-3xl tracking-tight text-[var(--color-fg)]">{title}</h2>
          <p className="text-sm leading-7 text-[var(--color-muted)] sm:text-base">{description}</p>
        </div>
        {children}
        {footer ? (
          <div className="border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted)]">
            {footer}
          </div>
        ) : null}
      </div>
    </main>
  )
}
