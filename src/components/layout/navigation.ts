import type { IconComponent } from "@/components/icon/Icon"
import {
  ClipboardIcon,
  CoffeeBeanIcon,
  CoffeeCupIcon,
  HeartIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SearchIcon,
  ShoppingBagIcon,
  StarIcon,
  UserIcon,
} from "@/components/icon/Icon"

export type NavigationLink = {
  href: string
  icon: IconComponent
  label: string
}

export type AppNavigationMode = "roaster" | "user"

export const publicNavigationLinks = [
  { href: "/", icon: HomeIcon, label: "HOME" },
  { href: "/about", icon: CoffeeCupIcon, label: "ABOUT" },
  { href: "/help", icon: QuestionMarkCircleIcon, label: "HELP" },
] as const satisfies readonly NavigationLink[]

const commonAppNavigationLinks = [
  { href: "/search", icon: SearchIcon, label: "Search" },
  { href: "/help", icon: QuestionMarkCircleIcon, label: "Help" },
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
      { href: "/roasters/home", icon: HomeIcon, label: "Home" },
      { href: `/roasters/${roasterId}`, icon: CoffeeCupIcon, label: "Roaster" },
      { href: "/beans", icon: CoffeeBeanIcon, label: "Beans" },
      { href: "/offers", icon: ClipboardIcon, label: "Offers" },
      ...commonAppNavigationLinks,
    ]
  }

  return [
    { href: "/users/home", icon: HomeIcon, label: "Home" },
    { href: `/users/${userId}`, icon: UserIcon, label: "User" },
    { href: `/users/${userId}/following`, icon: StarIcon, label: "Follow" },
    { href: "/wants", icon: ShoppingBagIcon, label: "Wants" },
    { href: "/likes", icon: HeartIcon, label: "Likes" },
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
