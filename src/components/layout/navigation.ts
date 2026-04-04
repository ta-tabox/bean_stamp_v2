export type NavigationLink = {
  href: string
  label: string
}

export const publicNavigationLinks = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/help", label: "HELP" },
] as const satisfies readonly NavigationLink[]

export const appNavigationLinks = [
  { href: "/users/home", label: "Home" },
  { href: "/beans", label: "Beans" },
  { href: "/offers", label: "Offers" },
  { href: "/wants", label: "Wants" },
  { href: "/likes", label: "Likes" },
  { href: "/search", label: "Search" },
] as const satisfies readonly NavigationLink[]
