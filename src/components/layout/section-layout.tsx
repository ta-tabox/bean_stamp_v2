import Link from "next/link";
import type { ReactNode } from "react";

type SectionLink = {
  href: string;
  label: string;
};

type SectionLayoutProps = {
  badge: string;
  children: ReactNode;
  description: string;
  links: readonly SectionLink[];
  title: string;
};

export function SectionLayout({
  badge,
  children,
  description,
  links,
  title,
}: SectionLayoutProps) {
  return (
    <div className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_70px_rgba(82,53,22,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            {badge}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            {description}
          </p>
          <nav className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-sm font-medium transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
            >
              公開トップ
            </Link>
            {links.map((link) => (
              <Link
                key={`${badge}-${link.href}`}
                href={link.href}
                className="rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-sm font-medium transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        {children}
      </div>
    </div>
  );
}
