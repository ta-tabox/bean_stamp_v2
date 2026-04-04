import Link from "next/link"
import type { ReactNode } from "react"

type SectionLink = {
  href: string
  label: string
}

type SectionLayoutProps = {
  badge: string
  children: ReactNode
  description: string
  links: readonly SectionLink[]
  title: string
}

export function SectionLayout({ badge, children, description, links, title }: SectionLayoutProps) {
  return (
    <div className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="page-card">
          <p className="panel-label">{badge}</p>
          <h1 className="title-font mt-3 text-3xl tracking-tight text-[var(--color-fg)]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
          <nav className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="btn btn-secondary"
            >
              公開トップ
            </Link>
            {links.map((link) => (
              <Link
                key={`${badge}-${link.label}-${link.href}`}
                href={link.href}
                className="btn btn-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        {children}
      </div>
    </div>
  )
}
