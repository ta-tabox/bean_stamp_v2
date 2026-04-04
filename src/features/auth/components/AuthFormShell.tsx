import type { ReactNode } from "react"

type AuthFormShellProps = {
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}

export function AuthFormShell({ children, description, footer, title }: AuthFormShellProps) {
  return (
    <section className="form-shell mt-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-3 text-center">
          <h2 className="title-font text-3xl text-[var(--color-fg)]">{title}</h2>
          <p className="text-sm leading-7 text-[var(--color-muted)] sm:text-base">{description}</p>
        </div>
        {children}
        {footer ? (
          <div className="border-t border-[var(--color-border)] pt-4 text-center text-sm text-[var(--color-muted)]">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  )
}
