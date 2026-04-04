import Link from "next/link"

import { appNavigationLinks } from "@/components/layout/navigation"

type AppNavigationProps = {
  className?: string
  orientation: "horizontal" | "vertical"
}

export function AppNavigation({ className, orientation }: AppNavigationProps) {
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
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={[
                  "flex items-center justify-between rounded-[1.25rem] border px-4 py-3 text-sm font-semibold transition",
                  orientation === "vertical" ? "min-w-[220px]" : "whitespace-nowrap",
                  "border-[var(--color-border)] bg-white/80 text-[var(--color-fg)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-accent-soft)]",
                ].join(" ")}
              >
                <span>{link.label}</span>
                <span className="logo-font text-[0.75rem] tracking-[0.18em] opacity-70">
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
