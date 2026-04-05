import { describe, expect, it } from "vitest"

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
import { buildAppNavigationLinks, resolveAppNavigationMode } from "@/components/layout/navigation"

describe("navigation", () => {
  it("ユーザーモードではユーザー向けリンクを返す", () => {
    expect(
      buildAppNavigationLinks({
        mode: "user",
        userId: "12",
      }),
    ).toEqual([
      { href: "/users/home", icon: HomeIcon, label: "Home" },
      { href: "/users/12", icon: UserIcon, label: "User" },
      { href: "/users/12/following", icon: StarIcon, label: "Follow" },
      { href: "/wants", icon: ShoppingBagIcon, label: "Wants" },
      { href: "/likes", icon: HeartIcon, label: "Likes" },
      { href: "/search", icon: SearchIcon, label: "Search" },
      { href: "/help", icon: QuestionMarkCircleIcon, label: "Help" },
    ])
  })

  it("ロースターモードではロースター向けリンクを返す", () => {
    expect(
      buildAppNavigationLinks({
        mode: "roaster",
        roasterId: "5",
        userId: "12",
      }),
    ).toEqual([
      { href: "/roasters/home", icon: HomeIcon, label: "Home" },
      { href: "/roasters/5", icon: CoffeeCupIcon, label: "Roaster" },
      { href: "/beans", icon: CoffeeBeanIcon, label: "Beans" },
      { href: "/offers", icon: ClipboardIcon, label: "Offers" },
      { href: "/search", icon: SearchIcon, label: "Search" },
      { href: "/help", icon: QuestionMarkCircleIcon, label: "Help" },
    ])
  })

  it("ロースター所属がなければ常にユーザーモードを返す", () => {
    expect(
      resolveAppNavigationMode({
        currentPath: "/roasters/home",
        hasRoasterMembership: false,
      }),
    ).toBe("user")
  })

  it("ロースター系ルートではロースターモードを返す", () => {
    expect(
      resolveAppNavigationMode({
        currentPath: "/offers",
        hasRoasterMembership: true,
      }),
    ).toBe("roaster")
  })

  it("ユーザー系ルートではユーザーモードを返す", () => {
    expect(
      resolveAppNavigationMode({
        currentPath: "/users/home",
        hasRoasterMembership: true,
      }),
    ).toBe("user")
  })
})
