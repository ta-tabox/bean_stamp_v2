"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { appNavigationLinks } from "@/components/layout/navigation"

type AppNavigationProps = {
  className?: string
  orientation: "horizontal" | "vertical"
}

export function AppNavigation({ className, orientation }: AppNavigationProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="アプリナビゲーション"
      className={className}
    >
      <ul
        className={
          orientation === "vertical"
            ? "flex flex-col gap-2"
            : "flex items-center gap-2 overflow-x-auto"
        }
      >
        {appNavigationLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={[
                  "flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition",
                  orientation === "vertical" ? "min-w-[220px]" : "whitespace-nowrap",
                  isActive
                    ? "bg-[var(--color-accent)] text-white shadow-[0_14px_30px_rgba(111,47,18,0.2)]"
                    : "border border-[var(--color-border)] bg-white/70 text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]",
                ].join(" ")}
              >
                <span>{link.label}</span>
                <span className="text-[0.65rem] tracking-[0.24em] opacity-70">
                  {link.href.replace("/", "").toUpperCase() || "ROOT"}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
