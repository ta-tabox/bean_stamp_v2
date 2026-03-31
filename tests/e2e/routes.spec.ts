import { expect, test } from "@playwright/test"

const publicRoutes = [
  { path: "/", heading: "公開ルートの入口" },
  { path: "/about", heading: "About" },
  { path: "/help", heading: "Help" },
  { path: "/auth/signin", heading: "Sign in" },
  { path: "/auth/signup", heading: "Sign up" },
  { path: "/auth/password_reset", heading: "Password reset" },
] as const

for (const route of publicRoutes) {
  test(`${route.path} が表示できる`, async ({ page }) => {
    const response = await page.goto(route.path)

    expect(response?.status(), `${route.path} should return 200`).toBe(200)
    await expect(page.locator("main")).toBeVisible()
    await expect(page.getByRole("heading", { name: route.heading, exact: true })).toBeVisible()
    await expect(page.getByText("This page could not be found")).toHaveCount(0)
  })
}

test("公開ヘッダーのナビゲーションで主要ページに遷移できる", async ({ page }) => {
  await page.goto("/")

  await page.getByRole("link", { name: "ABOUT", exact: true }).first().click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole("heading", { name: "About", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "HELP", exact: true }).first().click()
  await expect(page).toHaveURL(/\/help$/)
  await expect(page.getByRole("heading", { name: "Help", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "HOME", exact: true }).first().click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("heading", { name: "公開ルートの入口", exact: true })).toBeVisible()
})

test("未認証ユーザーは保護ページからサインインへリダイレクトされる", async ({ page }) => {
  await page.goto("/users/home")

  await expect(page).toHaveURL(/\/auth\/signin$/)
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible()
})

test("認証フローとセッション API が動作する", async ({ page }) => {
  const uniqueSuffix = Date.now()
  const email = `auth-${uniqueSuffix}@example.com`
  const initialPassword = `Initial-${uniqueSuffix}`
  const nextPassword = `Updated-${uniqueSuffix}`

  await page.goto("/auth/signup")
  await page.getByLabel("名前").fill("Auth Tester")
  await page.getByLabel("メールアドレス").fill(email)
  await page.getByLabel("都道府県コード").fill("13")
  await page.getByLabel("パスワード", { exact: true }).fill(initialPassword)
  await page.getByLabel("確認用パスワード").fill(initialPassword)
  await page.getByRole("button", { name: "登録する" }).click()

  await expect(page).toHaveURL(/\/auth\/signin\?registered=1/)
  await expect(page.getByText("登録が完了しました。サインインしてください。")).toBeVisible()

  await page.getByLabel("メールアドレス").fill(email)
  await page.getByLabel("パスワード", { exact: true }).fill(initialPassword)
  await page.getByRole("button", { name: "サインイン" }).click()

  await expect(page).toHaveURL(/\/users\/home$/)
  await expect(page.getByRole("heading", { name: "ユーザーホーム", exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "サインアウト" })).toBeVisible()

  const sessionResponse = await page.context().request.get("/api/v1/auth/sessions")
  expect(sessionResponse.ok()).toBeTruthy()
  await expect(await sessionResponse.json()).toMatchObject({
    is_login: true,
    user: {
      email,
      name: "Auth Tester",
      prefecture_code: "13",
      roaster_id: null,
    },
  })

  await page.goto("/auth/signin")
  await expect(page).toHaveURL(/\/users\/home$/)

  await page.goto("/roasters/home")
  await expect(page).toHaveURL(/\/users\/home$/)

  await page.goto("/roasters/new")
  await expect(page).toHaveURL(/\/roasters\/new$/)
  await expect(page.getByRole("heading", { name: "ロースター新規作成", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Offers" }).first().click()
  await expect(page).toHaveURL(/\/offers$/)
  await expect(page.getByRole("heading", { name: "オファー一覧", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Search" }).first().click()
  await expect(page).toHaveURL(/\/search$/)
  await expect(page.getByRole("heading", { name: "検索トップ", exact: true })).toBeVisible()

  await page.getByRole("button", { name: "サインアウト" }).click()
  await expect(page).toHaveURL(/\/auth\/signin$/)

  await page.goto("/auth/password_reset")
  await page.getByLabel("メールアドレス").fill(email)
  await page.getByRole("button", { name: "再設定メールを送る" }).click()

  await expect(page.getByText("パスワード再設定メールを送信しました。")).toBeVisible()
  await page.getByRole("link", { name: "パスワードを再設定する" }).click()
  await expect(page).toHaveURL(/\/auth\/password_reset\?token=/)

  await page.getByLabel("新しいパスワード").fill(nextPassword)
  await page.getByLabel("確認用パスワード").fill(nextPassword)
  await page.getByRole("button", { name: "パスワードを更新する" }).click()

  await expect(page).toHaveURL(/\/auth\/signin\?reset=1/)
  await page.getByLabel("メールアドレス").fill(email)
  await page.getByLabel("パスワード", { exact: true }).fill(nextPassword)
  await page.getByRole("button", { name: "サインイン" }).click()

  await expect(page).toHaveURL(/\/users\/home$/)
})
