export type NavigationLink = {
  href: string
  icon: string
  label: string
}

export const publicNavigationLinks = [
  { href: "/", icon: "home", label: "HOME" },
  { href: "/about", icon: "coffee-cup", label: "ABOUT" },
  { href: "/help", icon: "question-mark-circle", label: "HELP" },
] as const satisfies readonly NavigationLink[]

export const appNavigationLinks = [
  { href: "/users/home", icon: "home", label: "Home" },
  { href: "/beans", icon: "coffee-bean", label: "Beans" },
  { href: "/offers", icon: "clipboard", label: "Offers" },
  { href: "/wants", icon: "shopping-bag", label: "Wants" },
  { href: "/likes", icon: "heart", label: "Likes" },
  { href: "/search", icon: "search", label: "Search" },
] as const satisfies readonly NavigationLink[]
