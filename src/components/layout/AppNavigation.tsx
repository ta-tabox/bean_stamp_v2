import Link from "next/link"

import type { NavigationLink } from "@/components/layout/navigation"

type AppNavigationProps = {
  className?: string
  links: readonly NavigationLink[]
  orientation: "horizontal" | "vertical"
}

export function AppNavigation({ className, links, orientation }: AppNavigationProps) {
  return (
    <nav
      aria-label="アプリナビゲーション"
      className={className}
    >
      <ul
        className={
          orientation === "vertical"
            ? "flex flex-col items-center gap-2"
            : "flex items-center gap-2 overflow-x-auto px-4 pb-3"
        }
      >
        {links.map((link) => {
          const iconClassName =
            link.icon === "coffee-bean" ? "h-8 w-8 -rotate-45 transform" : "h-8 w-8"

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={[
                  orientation === "vertical"
                    ? "group relative inline-flex h-8 w-8 items-center justify-center text-gray-500 transition duration-200 hover:-translate-x-4 hover:text-gray-800"
                    : "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm text-gray-900 transition hover:bg-gray-800 hover:text-white",
                ].join(" ")}
              >
                {orientation === "vertical" ? (
                  <>
                    <svg className={iconClassName}>
                      <use href={`#${link.icon}`} />
                    </svg>
                    <span className="pointer-events-none absolute left-full top-1/2 ml-1 -translate-y-1/2 font-serif text-sm italic opacity-0 transition group-hover:opacity-100">
                      {link.label}
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5">
                      <use href={`#${link.icon}`} />
                    </svg>
                    <span>{link.label}</span>
                  </>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
