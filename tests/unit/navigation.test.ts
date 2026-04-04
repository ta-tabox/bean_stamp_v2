import { describe, expect, it } from "vitest"

import { buildAppNavigationLinks, resolveAppNavigationMode } from "@/components/layout/navigation"

describe("navigation", () => {
  it("ユーザーモードではユーザー向けリンクを返す", () => {
    expect(
      buildAppNavigationLinks({
        mode: "user",
        userId: "12",
      }),
    ).toEqual([
      { href: "/users/home", icon: "home", label: "Home" },
      { href: "/users/12", icon: "user", label: "User" },
      { href: "/users/12/following", icon: "star", label: "Follow" },
      { href: "/wants", icon: "shopping-bag", label: "Wants" },
      { href: "/likes", icon: "heart", label: "Likes" },
      { href: "/search", icon: "search", label: "Search" },
      { href: "/help", icon: "question-mark-circle", label: "Help" },
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
      { href: "/roasters/home", icon: "home", label: "Home" },
      { href: "/roasters/5", icon: "coffee-cup", label: "Roaster" },
      { href: "/beans", icon: "coffee-bean", label: "Beans" },
      { href: "/offers", icon: "clipboard", label: "Offers" },
      { href: "/search", icon: "search", label: "Search" },
      { href: "/help", icon: "question-mark-circle", label: "Help" },
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
