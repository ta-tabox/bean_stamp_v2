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
  const updatedEmail = `auth-updated-${uniqueSuffix}@example.com`
  const secondEmail = `follow-${uniqueSuffix}@example.com`
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

  const sessionPayload = await page.evaluate(async () => {
    const response = await fetch("/api/v1/auth/sessions")

    return {
      ok: response.ok,
      payload: await response.json(),
    }
  })

  expect(sessionPayload.ok).toBeTruthy()
  await expect(sessionPayload.payload).toMatchObject({
    is_login: true,
    user: {
      email,
      name: "Auth Tester",
      prefecture_code: "13",
      roaster_id: null,
    },
  })
  const userId = String(sessionPayload.payload.user.id)

  await page.goto("/auth/signin")
  await expect(page).toHaveURL(/\/users\/home$/)

  await page.goto("/roasters/home")
  await expect(page).toHaveURL(/\/roasters\/home$/)
  await expect(page.getByText("まだロースターに所属していません")).toBeVisible()

  await page.goto(`/users/${userId}`)
  await expect(
    page.getByRole("heading", { name: `ユーザー詳細 #${userId}`, exact: true }),
  ).toBeVisible()
  await expect(page.getByText(updatedEmail)).toHaveCount(0)
  await expect(page.getByRole("link", { name: "フォロー中ロースターを見る" })).toBeVisible()

  await page.goto("/users/edit")
  await expect(page.getByRole("main").getByRole("link", { name: "パスワード変更" })).toBeVisible()
  await expect(page.getByRole("main").getByRole("link", { name: "退会する" })).toBeVisible()
  await page.getByLabel("名前").fill("Auth Tester Updated")
  await page.getByLabel("メールアドレス").fill(updatedEmail)
  await page.getByLabel("都道府県コード").fill("27")
  await page.getByLabel("自己紹介").fill("プロフィール更新の確認")
  await page.getByRole("button", { name: "更新する" }).click()

  await expect(page).toHaveURL(new RegExp(`/users/${userId}\\?updated=1`))
  await expect(page.getByText("プロフィールを更新しました。")).toBeVisible()

  await page.goto("/roasters/new")
  await expect(page).toHaveURL(/\/roasters\/new$/)
  await expect(page.getByRole("heading", { name: "ロースター新規作成", exact: true })).toBeVisible()
  await page.getByLabel("ロースター名").fill("Auth Roaster")
  await page.getByLabel("電話番号").fill("03-0000-1234")
  await page.getByLabel("都道府県コード").fill("27")
  await page.getByLabel("住所").fill("Osaka")
  await page.getByLabel("紹介文").fill("自家焙煎のテストロースター")
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page).toHaveURL(/\/roasters\/\d+\?created=1$/)
  await expect(page.getByText("ロースターを作成しました。")).toBeVisible()
  const roasterId = page.url().match(/\/roasters\/(\d+)/)?.[1]
  expect(roasterId).toBeTruthy()
  await expect(page.getByRole("heading", { name: "Auth Roaster", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "ロースターを編集" })).toBeVisible()

  const roasterPayload = await page.evaluate(
    async ({ currentRoasterId, currentUserId }) => {
      const [roasterResponse, userResponse] = await Promise.all([
        fetch(`/api/v1/roasters/${currentRoasterId}`),
        fetch(`/api/v1/users/${currentUserId}`),
      ])

      return {
        roaster: await roasterResponse.json(),
        user: await userResponse.json(),
      }
    },
    { currentRoasterId: roasterId, currentUserId: userId },
  )

  await expect(roasterPayload.roaster).toMatchObject({
    followers_count: 0,
    name: "Auth Roaster",
    prefecture_code: "27",
    roaster_relationship_id: null,
  })
  await expect(roasterPayload.user).toMatchObject({
    email: updatedEmail,
    name: "Auth Tester Updated",
    prefecture_code: "27",
    roaster_id: Number(roasterId),
  })

  await page.goto("/roasters/edit")
  await expect(
    page.getByRole("main").getByRole("link", { name: "ロースターを削除する" }),
  ).toBeVisible()
  await page.getByLabel("紹介文").fill("説明を更新しました")
  await page.getByRole("button", { name: "更新する" }).click()
  await expect(page).toHaveURL(new RegExp(`/roasters/${roasterId}\\?updated=1`))
  await expect(page.getByText("ロースターを更新しました。")).toBeVisible()
  await expect(page.getByRole("link", { name: "フォロワー一覧を見る" })).toBeVisible()

  await page.getByRole("link", { name: "Offers" }).first().click()
  await expect(page).toHaveURL(/\/offers$/)
  await expect(page.getByRole("heading", { name: "オファー一覧", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Search" }).first().click()
  await expect(page).toHaveURL(/\/search$/)
  await expect(page.getByRole("heading", { name: "検索トップ", exact: true })).toBeVisible()

  await page.getByRole("button", { name: "サインアウト" }).click()
  await expect(page).toHaveURL(/\/auth\/signin$/)

  await page.goto("/auth/signup")
  await page.getByLabel("名前").fill("Follower User")
  await page.getByLabel("メールアドレス").fill(secondEmail)
  await page.getByLabel("都道府県コード").fill("14")
  await page.getByLabel("パスワード", { exact: true }).fill(initialPassword)
  await page.getByLabel("確認用パスワード").fill(initialPassword)
  await page.getByRole("button", { name: "登録する" }).click()
  await expect(page).toHaveURL(/\/auth\/signin\?registered=1/)

  await page.getByLabel("メールアドレス").fill(secondEmail)
  await page.getByLabel("パスワード", { exact: true }).fill(initialPassword)
  await page.getByRole("button", { name: "サインイン" }).click()
  await expect(page).toHaveURL(/\/users\/home$/)

  const secondSessionPayload = await page.evaluate(async () => {
    const response = await fetch("/api/v1/auth/sessions")

    return await response.json()
  })
  const secondUserId = String(secondSessionPayload.user.id)

  await page.goto(`/roasters/${roasterId}`)
  await expect(page.getByRole("button", { name: "フォローする" })).toBeVisible()
  await page.getByRole("button", { name: "フォローする" }).click()
  await expect(page).toHaveURL(new RegExp(`/roasters/${roasterId}\\?followed=1`))
  await expect(page.getByText("ロースターをフォローしました。")).toBeVisible()
  await expect(page.getByRole("button", { name: "フォロー解除" })).toBeVisible()

  const followPayload = await page.evaluate(
    async ({ currentRoasterId, currentUserId }) => {
      const [relationshipResponse, followingResponse, followersResponse] = await Promise.all([
        fetch(`/api/v1/roaster_relationships?roaster_id=${currentRoasterId}`),
        fetch(`/api/v1/users/${currentUserId}/roasters_followed_by_user`),
        fetch(`/api/v1/roasters/${currentRoasterId}/followers`),
      ])

      return {
        followers: await followersResponse.json(),
        following: await followingResponse.json(),
        relationship: await relationshipResponse.json(),
      }
    },
    { currentRoasterId: roasterId, currentUserId: secondUserId },
  )

  await expect(followPayload.relationship).toMatchObject({
    is_followed_by_signed_in_user: true,
  })
  expect(followPayload.relationship.roaster_relationship_id).toBeTruthy()
  await expect(followPayload.following).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: Number(roasterId),
        name: "Auth Roaster",
      }),
    ]),
  )
  await expect(followPayload.followers).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        email: secondEmail,
        id: Number(secondUserId),
        name: "Follower User",
      }),
    ]),
  )

  await page.goto(`/users/${secondUserId}/following`)
  await expect(
    page.getByRole("heading", { name: `フォロー一覧 #${secondUserId}`, exact: true }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "ロースターを探す" })).toBeVisible()

  await page.goto(`/roasters/${roasterId}/follower`)
  await expect(
    page.getByRole("heading", { name: `フォロワー一覧 #${roasterId}`, exact: true }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: /Follower User/ })).toBeVisible()

  await page.goto(`/roasters/${roasterId}`)
  await page.getByRole("button", { name: "フォロー解除" }).click()
  await expect(page).toHaveURL(new RegExp(`/roasters/${roasterId}\\?unfollowed=1`))
  await expect(page.getByText("ロースターのフォローを解除しました。")).toBeVisible()

  await page.getByRole("button", { name: "サインアウト" }).click()
  await expect(page).toHaveURL(/\/auth\/signin$/)

  await page.goto("/auth/password_reset")
  await page.getByLabel("メールアドレス").fill(secondEmail)
  await page.getByRole("button", { name: "再設定メールを送る" }).click()

  await expect(page.getByText("パスワード再設定メールを送信しました。")).toBeVisible()
  await page.getByRole("link", { name: "パスワードを再設定する" }).click()
  await expect(page).toHaveURL(/\/auth\/password_reset\?token=/)

  await page.getByLabel("新しいパスワード").fill(nextPassword)
  await page.getByLabel("確認用パスワード").fill(nextPassword)
  await page.getByRole("button", { name: "パスワードを更新する" }).click()

  await expect(page).toHaveURL(/\/auth\/signin\?reset=1/)
  await page.getByLabel("メールアドレス").fill(secondEmail)
  await page.getByLabel("パスワード", { exact: true }).fill(nextPassword)
  await page.getByRole("button", { name: "サインイン" }).click()

  await expect(page).toHaveURL(/\/users\/home$/)
})
