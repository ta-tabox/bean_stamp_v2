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
          const IconComponent = link.icon
          const iconClassName = link.label === "Beans" ? "h-8 w-8 -rotate-45 transform" : "h-8 w-8"

          return (
            <li
              key={link.href}
              className={orientation === "vertical" ? "w-20" : undefined}
            >
              <Link
                href={link.href}
                className={[
                  orientation === "vertical"
                    ? "group relative flex h-12 w-full items-center justify-center rounded-xl text-gray-500 transition duration-200 hover:bg-gray-100 hover:text-gray-800"
                    : "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm text-gray-900 transition hover:bg-gray-800 hover:text-white",
                ].join(" ")}
              >
                {orientation === "vertical" ? (
                  <>
                    <IconComponent className={iconClassName} />
                    <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 font-serif text-sm italic text-gray-700 opacity-0 shadow-sm ring-1 ring-gray-200 transition group-hover:opacity-100">
                      {link.label}
                    </span>
                  </>
                ) : (
                  <>
                    <IconComponent className="h-5 w-5" />
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
