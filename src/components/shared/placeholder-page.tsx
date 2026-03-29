import Link from "next/link"

type PlaceholderLink = {
  href: string
  label: string
}

type PlaceholderPageProps = {
  description: string
  eyebrow: string
  links: readonly PlaceholderLink[]
  title: string
}

export function PlaceholderPage({ description, eyebrow, links, title }: PlaceholderPageProps) {
  return (
    <main className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_24px_90px_rgba(82,53,22,0.08)] backdrop-blur sm:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <Link
              key={`${title}-${link.href}`}
              href={link.href}
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[0_12px_40px_rgba(82,53,22,0.08)]"
            >
              <div className="text-sm font-semibold">{link.label}</div>
              <div className="mt-1 text-xs text-[var(--color-ink-soft)]">{link.href}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
