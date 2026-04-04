export type NavigationLink = {
  href: string
  icon: string
  label: string
}

export type AppNavigationMode = "roaster" | "user"

export const publicNavigationLinks = [
  { href: "/", icon: "home", label: "HOME" },
  { href: "/about", icon: "coffee-cup", label: "ABOUT" },
  { href: "/help", icon: "question-mark-circle", label: "HELP" },
] as const satisfies readonly NavigationLink[]

const commonAppNavigationLinks = [
  { href: "/search", icon: "search", label: "Search" },
  { href: "/help", icon: "question-mark-circle", label: "Help" },
] as const satisfies readonly NavigationLink[]

export function buildAppNavigationLinks({
  mode,
  roasterId,
  userId,
}: {
  mode: AppNavigationMode
  roasterId?: string | null
  userId: string
}): readonly NavigationLink[] {
  if (mode === "roaster" && roasterId) {
    return [
      { href: "/roasters/home", icon: "home", label: "Home" },
      { href: `/roasters/${roasterId}`, icon: "coffee-cup", label: "Roaster" },
      { href: "/beans", icon: "coffee-bean", label: "Beans" },
      { href: "/offers", icon: "clipboard", label: "Offers" },
      ...commonAppNavigationLinks,
    ]
  }

  return [
    { href: "/users/home", icon: "home", label: "Home" },
    { href: `/users/${userId}`, icon: "user", label: "User" },
    { href: `/users/${userId}/following`, icon: "star", label: "Follow" },
    { href: "/wants", icon: "shopping-bag", label: "Wants" },
    { href: "/likes", icon: "heart", label: "Likes" },
    ...commonAppNavigationLinks,
  ]
}

const userNavigationPrefixes = ["/users", "/wants", "/likes"] as const
const roasterNavigationPrefixes = ["/roasters", "/beans", "/offers"] as const

export function resolveAppNavigationMode({
  currentPath,
  hasRoasterMembership,
}: {
  currentPath: string
  hasRoasterMembership: boolean
}): AppNavigationMode {
  if (!hasRoasterMembership) {
    return "user"
  }

  if (roasterNavigationPrefixes.some((prefix) => currentPath.startsWith(prefix))) {
    return "roaster"
  }

  if (userNavigationPrefixes.some((prefix) => currentPath.startsWith(prefix))) {
    return "user"
  }

  return "user"
}
