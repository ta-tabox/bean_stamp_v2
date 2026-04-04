"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { publicNavigationLinks } from "@/components/layout/navigation"

type SiteHeaderProps = {
  action?: ReactNode
  showSignInLink?: boolean
}

export function SiteHeader({ action, showSignInLink = true }: SiteHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color:var(--color-header)]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-strong)] text-xs font-semibold tracking-[0.25em] text-[var(--color-accent-strong)] shadow-[0_10px_24px_rgba(86,52,28,0.12)]">
              BS
            </span>
            <div className="min-w-0">
              <p className="text-[0.7rem] font-semibold tracking-[0.35em] text-[var(--color-accent)]">
                BEAN STAMP
              </p>
              <p className="truncate text-sm text-[var(--color-ink-soft)]">
                Common layout migration
              </p>
            </div>
          </Link>
          <nav
            aria-label="公開ナビゲーション"
            className="hidden items-center gap-2 md:flex"
          >
            {publicNavigationLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold tracking-[0.2em] transition",
                    isActive
                      ? "bg-[var(--color-accent)] text-white shadow-[0_12px_28px_rgba(111,47,18,0.22)]"
                      : "text-[var(--color-fg)] hover:bg-[var(--color-accent-soft)]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {action}
          {showSignInLink ? (
            <Link
              href="/auth/signin"
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition hover:bg-white/70"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </div>
      <nav
        aria-label="公開ナビゲーション モバイル"
        className="flex gap-2 overflow-x-auto px-4 pb-4 md:hidden sm:px-6"
      >
        {publicNavigationLinks.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.24em] transition",
                isActive
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] bg-white/70 text-[var(--color-fg)]",
              ].join(" ")}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
