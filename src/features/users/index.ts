export function buildUsersRoutes(userId: string) {
  return [
    { href: "/users/home", label: "ユーザーホーム" },
    { href: `/users/${userId}`, label: "プロフィール" },
    { href: `/users/${userId}/following`, label: "フォロー中ロースター" },
    { href: "/users/edit", label: "プロフィール編集" },
    { href: "/users/password", label: "パスワード変更" },
    { href: "/users/cancel", label: "退会" },
  ] as const
}
