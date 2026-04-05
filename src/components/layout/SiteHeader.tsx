import Link from "next/link"
import type { ReactNode } from "react"

import { publicNavigationLinks } from "@/components/layout/navigation"

type SiteHeaderProps = {
  action?: ReactNode
  showSignInLink?: boolean
}

export function SiteHeader({ action, showSignInLink = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-14 border-y border-gray-200 bg-gray-100/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between gap-6 px-2 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center"
          >
            <span className="logo-font text-2xl text-yellow-800 md:text-3xl">Bean Stamp</span>
          </Link>
          <nav
            aria-label="公開ナビゲーション"
            className="hidden h-full md:block"
          >
            <ul className="flex h-full items-center">
              {publicNavigationLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={
                    index < publicNavigationLinks.length - 1 ? "border-r border-gray-300" : ""
                  }
                >
                  <Link
                    href={link.href}
                    className="e-nav-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          {showSignInLink ? (
            <Link
              href="/auth/signin"
              className="e-nav-link !h-10 !px-4 !text-xs md:!text-sm"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
