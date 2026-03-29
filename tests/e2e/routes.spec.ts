import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: "公開ルートの入口" },
  { path: "/about", heading: "About" },
  { path: "/help", heading: "Help" },
  { path: "/auth/signin", heading: "Sign in" },
  { path: "/auth/signup", heading: "Sign up" },
  { path: "/auth/password_reset", heading: "Password reset" },
  { path: "/users/home", heading: "ユーザーホーム" },
  { path: "/users/1", heading: "ユーザー詳細 #1" },
  { path: "/users/1/following", heading: "フォロー一覧 #1" },
  { path: "/users/edit", heading: "プロフィール編集" },
  { path: "/users/password", heading: "パスワード変更" },
  { path: "/users/cancel", heading: "ユーザー退会" },
  { path: "/roasters/home", heading: "ロースターホーム" },
  { path: "/roasters/new", heading: "ロースター新規作成" },
  { path: "/roasters/edit", heading: "ロースター編集" },
  { path: "/roasters/cancel", heading: "ロースター終了" },
  { path: "/roasters/1", heading: "ロースター詳細 #1" },
  { path: "/roasters/1/follower", heading: "フォロワー一覧 #1" },
  { path: "/beans", heading: "豆一覧" },
  { path: "/beans/new", heading: "豆新規作成" },
  { path: "/beans/1", heading: "豆詳細 #1" },
  { path: "/beans/1/edit", heading: "豆編集 #1" },
  { path: "/offers", heading: "オファー一覧" },
  { path: "/offers/1", heading: "オファー詳細 #1" },
  { path: "/offers/1/wanted_users", heading: "応募ユーザー一覧 #1" },
  { path: "/wants", heading: "Want 一覧" },
  { path: "/wants/1", heading: "Want 詳細 #1" },
  { path: "/likes", heading: "Like 一覧" },
  { path: "/search", heading: "検索トップ" },
  { path: "/search/roasters", heading: "ロースター検索" },
  { path: "/search/offers", heading: "オファー検索" },
] as const;

for (const route of routes) {
  test(`${route.path} が表示できる`, async ({ page }) => {
    const response = await page.goto(route.path);

    expect(response?.status(), `${route.path} should return 200`).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: route.heading, exact: true }),
    ).toBeVisible();
    await expect(page.getByText("This page could not be found")).toHaveCount(0);
  });
}
