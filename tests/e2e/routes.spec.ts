import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const publicRoutes = [
  { path: "/", heading: "Bean Stamp" },
  { path: "/about", heading: "Bean Stampとは" },
  { path: "/help", heading: "Bean Stampの使い方" },
  { path: "/auth/signin", heading: "Sign in" },
  { path: "/auth/signup", heading: "Sign up" },
  { path: "/auth/password_reset", heading: "Password reset" },
] as const

for (const route of publicRoutes) {
  test(`${route.path} が表示できる`, async ({ page }) => {
    const response = await page.goto(route.path)

    expect(response?.status(), `${route.path} should return 200`).toBe(200)
    await expect(page.getByRole("heading", { name: route.heading, exact: true })).toBeVisible()
    await expect(page.getByText("This page could not be found")).toHaveCount(0)
  })
}

test("公開ヘッダーのナビゲーションで主要ページに遷移できる", async ({ page }) => {
  await page.goto("/")

  await page.getByRole("link", { name: "ABOUT", exact: true }).first().click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole("heading", { name: "Bean Stampとは", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "HELP", exact: true }).first().click()
  await expect(page).toHaveURL(/\/help$/)
  await expect(page.getByRole("heading", { name: "Bean Stampの使い方", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "HOME", exact: true }).first().click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("heading", { name: "Bean Stamp", exact: true })).toBeVisible()
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
  await expect(
    page.getByRole("heading", { name: "Auth Testerのホーム", exact: true }),
  ).toBeVisible()
  await expect(page.getByRole("button", { name: "更新" })).toBeVisible()
  await expect(page.getByText("オファーがありません")).toBeVisible()
  await expect(
    page.getByRole("link", { name: "ロースターをフォローしてオファーを受け取る" }),
  ).toBeVisible()
  await expect(visibleButton(page, "SignOut")).toBeVisible()

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
  await expect(visibleAppNavLink(page, `/users/${userId}`)).toBeVisible()
  await expect(visibleAppNavLink(page, `/users/${userId}/following`)).toBeVisible()
  await expect(visibleAppNavLink(page, "/wants")).toBeVisible()

  await page.goto("/auth/signin")
  await expect(page).toHaveURL(/\/users\/home$/)

  await page.goto("/roasters/home")
  await expect(page).toHaveURL(/\/roasters\/home$/)
  await expect(page.getByText("まだロースターに所属していません")).toBeVisible()

  await page.goto(`/users/${userId}`)
  await expect(page.getByRole("heading", { name: "ユーザー詳細", exact: true })).toBeVisible()
  await expect(page.getByText(updatedEmail)).toHaveCount(0)
  await expect(page.getByText("東京都", { exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "フォロー一覧" })).toBeVisible()
  await expectCompactActionLink(page, "編集")
  await expectProfileSummaryDesktopLayout(page, "Auth Tester")

  await page.goto("/users/edit")
  await expect(page.getByRole("link", { name: "パスワード変更" })).toBeVisible()
  await expect(page.getByRole("link", { name: "退会する" })).toBeVisible()
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
  await expect(page.getByRole("link", { name: "編集" })).toBeVisible()
  await expectCompactActionLink(page, "編集")
  await expectProfileSummaryDesktopLayout(page, "Auth Roaster")

  await page.goto("/roasters/home")
  await expect(
    page.getByRole("heading", { name: "Auth Roasterのホーム", exact: true }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "オファーを作成する" })).toBeVisible()
  await expect(visibleAppNavLink(page, `/roasters/${roasterId}`)).toBeVisible()
  await expect(visibleAppNavLink(page, "/offers")).toBeVisible()

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
  await expect(page.getByRole("link", { name: "ロースターを削除する" })).toBeVisible()
  await page.getByLabel("紹介文").fill("説明を更新しました")
  await page.getByRole("button", { name: "更新する" }).click()
  await expect(page).toHaveURL(new RegExp(`/roasters/${roasterId}\\?updated=1`))
  await expect(page.getByText("ロースターを更新しました。")).toBeVisible()
  await expect(page.getByRole("link", { name: "フォロワー一覧" })).toBeVisible()

  await page.goto("/offers")
  await expect(page).toHaveURL(/\/offers$/)
  await expect(page.getByRole("heading", { name: "オファー 一覧", exact: true })).toBeVisible()

  await page.goto("/search")
  await expect(page).toHaveURL(/\/search$/)
  await expect(page.getByRole("heading", { name: "検索トップ", exact: true })).toBeVisible()

  await visibleButton(page, "SignOut").evaluate((button) => button.closest("form")?.requestSubmit())
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
  await expect(page.getByRole("heading", { name: "フォロー", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: /Auth Roaster/ })).toBeVisible()
  await expect(page.getByRole("link", { name: "プロフィールを編集" })).toHaveCount(0)

  await page.goto(`/roasters/${roasterId}/follower`)
  await expect(page.getByRole("heading", { name: "フォロワー", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: /Follower User/ })).toBeVisible()

  await page.goto(`/roasters/${roasterId}`)
  await page.getByRole("button", { name: "フォロー解除" }).click()
  await expect(page).toHaveURL(new RegExp(`/roasters/${roasterId}\\?unfollowed=1`))
  await expect(page.getByText("ロースターのフォローを解除しました。")).toBeVisible()

  await visibleButton(page, "SignOut").evaluate((button) => button.closest("form")?.requestSubmit())
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
  await page
    .getByRole("button", { name: "サインイン" })
    .evaluate((button) => button.closest("form")?.requestSubmit())

  await expect(page).toHaveURL(/\/users\/home$/)
})

test("ロースター所属ユーザーは Bean を作成・更新・削除でき、入力エラーが表示される", async ({
  page,
}) => {
  const uniqueSuffix = Date.now()
  const email = `beans-${uniqueSuffix}@example.com`
  const password = `Beans-${uniqueSuffix}`

  await signUpAndSignIn(page, {
    email,
    name: "Beans Tester",
    password,
    prefectureCode: "13",
  })

  await createRoaster(page, {
    address: "Tokyo",
    describe: "Bean 用のロースター",
    name: "Bean Roaster",
    phoneNumber: "03-1111-2222",
    prefectureCode: "13",
  })

  await page.goto("/beans")
  await expect(page.getByRole("heading", { name: "コーヒー豆一覧", exact: true })).toBeVisible()
  await page.getByRole("link", { name: "コーヒー豆を登録する" }).click()

  await expect(page).toHaveURL(/\/beans\/new$/)
  await expect(page.getByRole("heading", { name: "コーヒー豆登録", exact: true })).toBeVisible()
  await expect(page.getByTestId("bean-mutation-form")).toHaveAttribute("data-form-ready", "1")
  await page.getByLabel("豆の名前").fill("House Blend")
  await page.getByLabel("生産国").selectOption("44")
  await page.getByLabel("焙煎度").selectOption("2")
  await page.getByLabel("jasmine", { exact: true }).check()
  await page.getByLabel("画像").setInputFiles("tests/fixtures/bean-image.svg")
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page.getByText("フレーバーは2個以上登録してください")).toBeVisible()

  await page.getByLabel("豆の名前").fill("House Blend")
  await page.getByLabel("生産国").selectOption("44")
  await page.getByLabel("焙煎度").selectOption("2")
  await page.getByLabel("jasmine", { exact: true }).check()
  await page.getByLabel("orange", { exact: true }).check()
  await page.getByLabel("画像").setInputFiles("tests/fixtures/bean-image.svg")
  await page.getByLabel("紹介文").fill("毎日飲めるハウスブレンドです。")
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page).toHaveURL(/\/beans\/\d+\?created=1$/)
  await expect(page.getByText("コーヒー豆を登録しました。")).toBeVisible()
  await expect(page.getByRole("heading", { name: "コーヒー豆詳細", exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "House Blend", exact: true })).toBeVisible()
  await expect(page.getByText("毎日飲めるハウスブレンドです。")).toBeVisible()

  await page.getByRole("link", { name: "編集する" }).click()
  await expect(page).toHaveURL(/\/beans\/\d+\/edit$/)
  await expect(page.getByTestId("bean-mutation-form")).toHaveAttribute("data-form-ready", "1")
  await page.getByLabel("紹介文").fill("説明を更新しました。")
  await page.getByRole("button", { name: "更新する" }).click()

  await expect(page).toHaveURL(/\/beans\/\d+\?updated=1$/)
  await expect(page.getByText("コーヒー豆情報を変更しました。")).toBeVisible()
  await expect(page.getByText("説明を更新しました。")).toBeVisible()

  await expect(page.getByTestId("bean-delete-form")).toHaveAttribute("data-form-ready", "1")
  await page.getByRole("button", { name: "コーヒー豆を削除する" }).click()
  await expect(page).toHaveURL(/\/beans\?deleted=1$/)
  await expect(page.getByText("コーヒー豆を削除しました。")).toBeVisible()
  await expect(page.getByText("コーヒー豆が登録されていません")).toBeVisible()
})

test("ロースター所属ユーザーは Offer を作成・更新・削除でき、wanted users 画面に到達できる", async ({
  page,
}) => {
  const uniqueSuffix = Date.now()
  const email = `offers-${uniqueSuffix}@example.com`
  const password = `Offers-${uniqueSuffix}`

  await signUpAndSignIn(page, {
    email,
    name: "Offers Tester",
    password,
    prefectureCode: "13",
  })

  await createRoaster(page, {
    address: "Tokyo",
    describe: "Offer 用のロースター",
    name: "Offer Roaster",
    phoneNumber: "03-3333-4444",
    prefectureCode: "13",
  })

  const beanId = await createBean(page, {
    describe: "オファー用の豆です。",
    name: "Offer Blend",
  })

  await page.goto(`/beans/${beanId}`)
  await page.getByRole("link", { name: "この豆をオファーする" }).click()

  await expect(page).toHaveURL(new RegExp(`/offers/new\\?beanId=${beanId}`))
  await expect(page.getByRole("heading", { name: "オファー登録", exact: true })).toBeVisible()
  await expect(page.getByTestId("offer-mutation-form")).toHaveAttribute("data-form-ready", "1")
  await expect(page.getByRole("button", { name: "保存する" })).toBeDisabled()

  await page.getByLabel("価格").fill("1800")
  await page.getByLabel("内容量(g)").fill("200")
  await page.getByLabel("数量").fill("12")
  await page.getByLabel("オファー終了日").fill(offsetDate(1))
  await page.getByLabel("焙煎日").fill(offsetDate(1))
  await page.getByLabel("受け取り開始日").fill(offsetDate(3))
  await page.getByLabel("受け取り終了日").fill(offsetDate(4))
  await expect(page.getByRole("button", { name: "保存する" })).toBeEnabled()
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page.getByText("焙煎日はオファー終了日より後の日付を指定してください")).toHaveCount(
    2,
  )
  await expect(page.getByTestId("offer-mutation-form")).toHaveAttribute("data-form-ready", "1")
  await expect(page.getByLabel("価格")).toHaveValue("1800")
  await expect(page.getByLabel("内容量(g)")).toHaveValue("200")
  await expect(page.getByLabel("数量")).toHaveValue("12")
  await expect(page.getByLabel("オファー終了日")).toHaveValue(offsetDate(1))
  await expect(page.getByLabel("焙煎日")).toHaveValue(offsetDate(1))

  await page.getByLabel("価格").fill("1800")
  await page.getByLabel("内容量(g)").fill("200")
  await page.getByLabel("数量").fill("12")
  await page.getByLabel("オファー終了日").fill(offsetDate(1))
  await page.getByLabel("焙煎日").fill(offsetDate(2))
  await page.getByLabel("受け取り開始日").fill(offsetDate(3))
  await page.getByLabel("受け取り終了日").fill(offsetDate(4))
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page).toHaveURL(/\/offers\/\d+\?created=1$/)
  await expect(page.getByText("オファーを登録しました。")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Offer Blend", exact: true })).toBeVisible()
  await expect(page.getByText("1800円 / 200 g")).toBeVisible()

  await page.goto("/roasters/home")
  await expect(
    page.getByRole("heading", { name: "Offer Roasterのホーム", exact: true }),
  ).toBeVisible()
  await expect(page.getByRole("tab", { name: "Overview", exact: true }).first()).toHaveAttribute(
    "aria-selected",
    "true",
  )
  await expect(page.getByText("生産国").first()).toBeVisible()
  await expect(page.getByText("精製方法").first()).toBeVisible()
  await expect(page.getByText("1800円 / 200 g").first()).toBeVisible()

  await page.getByRole("tab", { name: "Taste", exact: true }).first().click()
  await expect(page.getByTestId("home-taste-chart").first()).toBeVisible()
  await expect(page.getByLabel("Taste chart").first()).toBeVisible()

  await page.getByRole("tab", { name: "Schedule", exact: true }).first().click()
  await expect(page.getByText("オファー作成日").first()).toBeVisible()
  await expect(page.getByText("受け取り終了日").first()).toBeVisible()

  await page.getByRole("link", { name: "詳細", exact: true }).first().click()
  await expect(page).toHaveURL(/\/offers\/\d+$/)

  await page.getByRole("link", { name: "ウォントしたユーザー" }).click()
  await expect(page).toHaveURL(/\/offers\/\d+\/wanted_users$/)
  await expect(page.getByText("ウォントしているユーザーがいません")).toBeVisible()

  await page.goto(page.url().replace(/\/wanted_users$/, ""))
  await expect(page).toHaveURL(/\/offers\/\d+$/)

  await page.getByRole("link", { name: "編集" }).click()
  await expect(page).toHaveURL(/\/offers\/\d+\/edit$/)
  await expect(page.getByTestId("offer-mutation-form")).toHaveAttribute("data-form-ready", "1")
  await page.getByLabel("価格").fill("1900")
  await page.getByRole("button", { name: "更新する" }).click()

  await expect(page).toHaveURL(/\/offers\/\d+\?updated=1$/)
  await expect(page.getByText("オファー情報を更新しました。")).toBeVisible()
  await expect(page.getByText("1900円 / 200 g")).toBeVisible()

  await expect(page.getByTestId("offer-delete-form")).toHaveAttribute("data-form-ready", "1")
  await page.getByRole("button", { name: "削除" }).click()
  await expect(page).toHaveURL(/\/offers\?deleted=1$/)
  await expect(page.getByText("オファーを削除しました。")).toBeVisible()
  await expect(page.getByText("オファーがありません")).toBeVisible()
})

test("ユーザーは Offer 詳細から Want / Like を操作でき、一覧ページに反映される", async ({
  page,
}) => {
  const uniqueSuffix = Date.now()
  const roasterEmail = `want-like-roaster-${uniqueSuffix}@example.com`
  const followerEmail = `want-like-user-${uniqueSuffix}@example.com`
  const password = `WantLike-${uniqueSuffix}`

  await signUpAndSignIn(page, {
    email: roasterEmail,
    name: "Want Like Roaster",
    password,
    prefectureCode: "13",
  })

  await createRoaster(page, {
    address: "Tokyo",
    describe: "Want Like 用のロースター",
    name: "Want Like Roaster",
    phoneNumber: "03-7777-8888",
    prefectureCode: "13",
  })

  const roasterId = page.url().match(/\/roasters\/(\d+)/)?.[1]
  expect(roasterId).toBeTruthy()

  const beanId = await createBean(page, {
    describe: "Want Like 用の豆です。",
    name: "Want Like Blend",
  })

  await page.goto(`/beans/${beanId}`)
  await page.getByRole("link", { name: "この豆をオファーする" }).click()
  await page.getByLabel("価格").fill("2100")
  await page.getByLabel("内容量(g)").fill("180")
  await page.getByLabel("数量").fill("6")
  await page.getByLabel("オファー終了日").fill(offsetDate(1))
  await page.getByLabel("焙煎日").fill(offsetDate(2))
  await page.getByLabel("受け取り開始日").fill(offsetDate(3))
  await page.getByLabel("受け取り終了日").fill(offsetDate(4))
  await page.getByRole("button", { name: "保存する" }).click()
  await expect(page).toHaveURL(/\/offers\/\d+\?created=1$/)

  await visibleButton(page, "SignOut").evaluate((button) => button.closest("form")?.requestSubmit())
  await expect(page).toHaveURL(/\/auth\/signin$/)

  await signUpAndSignIn(page, {
    email: followerEmail,
    name: "Want Like User",
    password,
    prefectureCode: "14",
  })

  await page.goto(`/roasters/${roasterId}`)
  await page.getByRole("button", { name: "フォローする" }).click()
  await expect(page.getByText("ロースターをフォローしました。")).toBeVisible()
  await expect(page.getByText("このロースターのオファー")).toBeVisible()
  await expect(page.getByText("Want Like Blend")).toBeVisible()
  await expect(page.getByRole("button", { name: "ウォント", exact: true }).first()).toBeVisible()

  await page.goto("/users/home")
  await expect(page.getByText("Want Like Blend")).toBeVisible()
  await expect(page.getByRole("button", { name: "ウォント", exact: true }).first()).toBeVisible()
  await expect(page.getByRole("button", { name: "お気に入り", exact: true }).first()).toBeVisible()
  await page.getByRole("button", { name: "ウォント", exact: true }).first().click()
  await expect(page.getByText("Want Like Blendをウォントしました。")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "ウォント解除", exact: true }).first(),
  ).toBeVisible()
  await page.getByRole("button", { name: "お気に入り", exact: true }).first().click()
  await expect(page.getByText("Want Like Blendをお気に入りに追加しました")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "お気に入り解除", exact: true }).first(),
  ).toBeVisible()

  await page.getByRole("link", { name: "詳細", exact: true }).first().click()
  await expect(page).toHaveURL(/\/offers\/\d+$/)
  await expect(page.getByRole("button", { name: "ウォント解除", exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "お気に入り解除", exact: true })).toBeVisible()

  await page.goto("/wants")
  await expect(page.getByRole("heading", { name: "ウォント一覧", exact: true })).toBeVisible()
  await expect(page.getByText("Want Like Blend")).toBeVisible()
  await page.getByRole("link", { name: "ウォント詳細" }).click()
  await expect(page).toHaveURL(/\/wants\/\d+$/)
  await expect(page.getByRole("heading", { name: "ウォント詳細", exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "コーヒー豆を受け取りました!" })).toBeDisabled()

  await page.goto("/likes")
  await expect(page.getByRole("heading", { name: "お気に入り一覧", exact: true })).toBeVisible()
  await expect(page.getByText("Want Like Blend")).toBeVisible()
  await page.getByRole("button", { name: "お気に入り解除", exact: true }).click()
  await expect(page.getByText("Want Like Blendをお気に入りから外しました")).toBeVisible()
  await expect(page.getByText("お気に入りがありません")).toBeVisible()
})

function visibleAppNavLink(page: Page, href: string) {
  return page.locator(`nav[aria-label="アプリナビゲーション"] a[href="${href}"]:visible`).first()
}

function visibleButton(page: Page, name: string) {
  return page.getByRole("button", { name, exact: true }).filter({ visible: true }).first()
}

async function signUpAndSignIn(
  page: Page,
  input: {
    email: string
    name: string
    password: string
    prefectureCode: string
  },
) {
  await page.goto("/auth/signup")
  await page.getByLabel("名前").fill(input.name)
  await page.getByLabel("メールアドレス").fill(input.email)
  await page.getByLabel("都道府県コード").fill(input.prefectureCode)
  await page.getByLabel("パスワード", { exact: true }).fill(input.password)
  await page.getByLabel("確認用パスワード").fill(input.password)
  await page.getByRole("button", { name: "登録する" }).click()

  await expect(page).toHaveURL(/\/auth\/signin\?registered=1/)
  await page.getByLabel("メールアドレス").fill(input.email)
  await page.getByLabel("パスワード", { exact: true }).fill(input.password)
  await page.getByRole("button", { name: "サインイン" }).click()
  await expect(page).toHaveURL(/\/users\/home$/)
}

async function createRoaster(
  page: Page,
  input: {
    address: string
    describe: string
    name: string
    phoneNumber: string
    prefectureCode: string
  },
) {
  await page.goto("/roasters/new")
  await page.getByLabel("ロースター名").fill(input.name)
  await page.getByLabel("電話番号").fill(input.phoneNumber)
  await page.getByLabel("都道府県コード").fill(input.prefectureCode)
  await page.getByLabel("住所").fill(input.address)
  await page.getByLabel("紹介文").fill(input.describe)
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page).toHaveURL(/\/roasters\/\d+\?created=1$/)
}

async function createBean(
  page: Page,
  input: {
    describe: string
    name: string
  },
) {
  await page.goto("/beans/new")
  await page.getByLabel("豆の名前").fill(input.name)
  await page.getByLabel("生産国").selectOption("44")
  await page.getByLabel("焙煎度").selectOption("2")
  await page.getByLabel("jasmine", { exact: true }).check()
  await page.getByLabel("orange", { exact: true }).check()
  await page.getByLabel("画像").setInputFiles("tests/fixtures/bean-image.svg")
  await page.getByLabel("紹介文").fill(input.describe)
  await page.getByRole("button", { name: "保存する" }).click()

  await expect(page).toHaveURL(/\/beans\/\d+\?created=1$/)

  const beanId = page.url().match(/\/beans\/(\d+)/)?.[1]

  expect(beanId).toBeTruthy()

  return beanId as string
}

function offsetDate(days: number) {
  const value = new Date()

  value.setDate(value.getDate() + days)

  return value.toISOString().slice(0, 10)
}

async function expectCompactActionLink(page: Page, name: string) {
  const link = page.getByRole("link", { name, exact: true })

  await expect(link).toBeVisible()
  await expect(link).toHaveCSS("white-space", "nowrap")

  const box = await link.boundingBox()

  expect(box).not.toBeNull()
  expect(box?.width ?? 0).toBeGreaterThan(48)
  expect(box?.height ?? 0).toBeLessThan(44)
}

async function expectProfileSummaryDesktopLayout(page: Page, title: string) {
  const heading = page.getByRole("heading", { name: title, exact: true })
  const avatar = page.locator(".page-card .profile-avatar").first()

  await expect(heading).toBeVisible()
  await expect(avatar).toBeVisible()

  const headingBox = await heading.boundingBox()
  const avatarBox = await avatar.boundingBox()

  expect(headingBox).not.toBeNull()
  expect(avatarBox).not.toBeNull()
  expect(avatarBox?.x ?? 0).toBeGreaterThan((headingBox?.x ?? 0) + 180)
}
